import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SAMPLE_DOCUMENTS, type SampleDocument } from "../../../lib/rag-sample-docs";
import { cosineSimilarity } from "../../../lib/vector-utils";

type RagRequest = {
  question?: string;
  topK?: number;
};

type RetrievedChunk = {
  id: string;
  title: string;
  source: string;
  type: SampleDocument["type"];
  score: number;
  snippet: string;
};

const EMBEDDING_MODEL = "text-embedding-3-small";
const GENERATION_MODEL = "gpt-4o-mini";

let cachedEmbeddings:
  | {
    doc: SampleDocument;
    embedding: number[];
  }[]
  | null = null;

async function getDocumentEmbeddings(client: OpenAI) {
  if (cachedEmbeddings) return cachedEmbeddings;

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: SAMPLE_DOCUMENTS.map((doc) => doc.content),
  });

  cachedEmbeddings = response.data.map((item, index) => ({
    doc: SAMPLE_DOCUMENTS[index],
    embedding: item.embedding,
  }));

  return cachedEmbeddings;
}

function buildContext(retrieved: RetrievedChunk[]) {
  return retrieved
    .map(
      (item, index) =>
        `#${index + 1} [${item.title}] (${item.source})\n${item.snippet}`,
    )
    .join("\n\n");
}

function selectTopK(
  queryEmbedding: number[],
  docEmbeddings: Awaited<ReturnType<typeof getDocumentEmbeddings>>,
  topK: number,
): RetrievedChunk[] {
  const ranked = docEmbeddings
    .map((item) => ({
      doc: item.doc,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => ({
      id: item.doc.id,
      title: item.doc.title,
      source: item.doc.source,
      type: item.doc.type,
      score: Number(item.score.toFixed(4)),
      snippet: item.doc.content.slice(0, 420),
    }));

  return ranked;
}

function buildInstructions() {
  return [
    "あなたは CloudWork Manager チーム内で動作する社内向けRAGのPoCです。",
    "出力は日本語で、3-5文の簡潔な段落にまとめてください。",
    "提示されたコンテキストの根拠のみに依拠して回答し、推測は避けてください。",
    "コンテキストに十分な根拠がある場合は追加コメントを入れずに回答してください。",
    "コンテキストだけでは回答を裏付けられないときに限り、『社内ドキュメントを拡充する必要があります』と補足してください。",
  ].join("\n");
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const { question, topK = 3 }: RagRequest = await request.json();

  if (!question?.trim()) {
    return NextResponse.json(
      { error: "question is required" },
      { status: 400 },
    );
  }

  const normalizedTopK = Math.min(Math.max(topK, 1), SAMPLE_DOCUMENTS.length);

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const docEmbeddings = await getDocumentEmbeddings(client);

    const queryEmbeddingResponse = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: [question],
    });

    const queryEmbedding = queryEmbeddingResponse.data[0]?.embedding;

    if (!queryEmbedding) {
      throw new Error("Failed to create query embedding");
    }

    const retrieved = selectTopK(queryEmbedding, docEmbeddings, normalizedTopK);
    const context = buildContext(retrieved);

    const prompt = [
      "以下は社内ナレッジから検索した抜粋です。重要度順に並んでいます。",
      context,
      `ユーザーの質問: ${question}`,
      "上記コンテキストから引用しながら回答してください。足りない場合は不足を明記してください。",
    ].join("\n\n");

    const response = await client.responses.create({
      model: GENERATION_MODEL,
      instructions: buildInstructions(),
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 400,
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      return NextResponse.json(
        { error: "Empty response from OpenAI" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      answer,
      retrieved,
      model: GENERATION_MODEL,
      embeddingModel: EMBEDDING_MODEL,
    });
  } catch (error) {
    console.error("RAG playground error:", error);
    return NextResponse.json(
      { error: "Unexpected error while processing the RAG request" },
      { status: 500 },
    );
  }
}
