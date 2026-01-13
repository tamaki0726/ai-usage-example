import { NextResponse } from "next/server";
import OpenAI from "openai";

type MailRequest = {
  email?: string;
};

type MailSummary = {
  headline: string;
  sentiment: string;
  priority: string;
  points: string[];
  actions: string[];
};

type MailResponse = {
  summary: MailSummary;
  reply: string;
  model: string;
};

const GENERATION_MODEL = "gpt-4o-mini";

function buildInstructions() {
  return [
    "あなたはカスタマーサポート担当のAIアシスタントです。",
    "受信メール本文を読み、要点要約と返信文のドラフトを日本語で作成してください。",
    "出力は必ずJSONのみ。以下のキーを厳守: summary, reply。",
    "summary には headline, sentiment, priority, points, actions を含める。",
    "points と actions は3-5件の箇条書き相当の短文配列。",
    "reply は丁寧で簡潔、相手の感情に配慮した文体で作成。",
    "JSON以外の文字列やMarkdownは出力しない。",
  ].join("\n");
}

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("JSON not found in response");
  }
  return text.slice(start, end + 1);
}

function isValidSummary(value: MailSummary | undefined): value is MailSummary {
  return Boolean(
    value &&
      value.headline &&
      value.sentiment &&
      value.priority &&
      Array.isArray(value.points) &&
      value.points.length > 0 &&
      Array.isArray(value.actions) &&
      value.actions.length > 0,
  );
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const { email }: MailRequest = await request.json();

  if (!email?.trim()) {
    return NextResponse.json(
      { error: "email is required" },
      { status: 400 },
    );
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = [
      "以下は受信したメール本文です。要点要約と返信文を作成してください。",
      email,
    ].join("\n\n");

    const response = await client.responses.create({
      model: GENERATION_MODEL,
      instructions: buildInstructions(),
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 500,
    });

    const raw = response.output_text?.trim() ?? "";
    const jsonText = extractJson(raw);
    const parsed = JSON.parse(jsonText) as MailResponse;

    if (!parsed.reply || !isValidSummary(parsed.summary)) {
      return NextResponse.json(
        { error: "Invalid response format from OpenAI" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      summary: parsed.summary,
      reply: parsed.reply,
      model: GENERATION_MODEL,
    });
  } catch (error) {
    console.error("Mail generation error:", error);
    return NextResponse.json(
      { error: "Unexpected error while generating mail response" },
      { status: 500 },
    );
  }
}
