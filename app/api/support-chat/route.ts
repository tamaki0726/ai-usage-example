import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSupportSystemPrompt } from "../../../lib/support-faq";

const SYSTEM_PROMPT = buildSupportSystemPrompt();

type HistoryMessage = {
  role: "user" | "bot";
  content: string;
};

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const { message, history = [] }: { message?: string; history?: HistoryMessage[] } =
    await request.json();

  if (!message?.trim()) {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400 },
    );
  }

  const conversation = history
    .slice(-6)
    .map((item) => ({
      role: item.role === "bot" ? "assistant" : "user",
      content: item.content,
    }))
    .filter((item) => item.content.trim().length > 0);

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const conversationText = conversation
    .map((item) =>
      item.role === "assistant"
        ? `AI: ${item.content}`
        : `ユーザー: ${item.content}`,
    )
    .join("\n");

  const promptInput = `${conversationText ? `${conversationText}\n` : ""}ユーザー: ${message}\nAI:`;

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions: SYSTEM_PROMPT,
      input: promptInput,
      temperature: 0.2,
      max_output_tokens: 400,
    });

    const reply = response.output_text?.trim() ?? "";

    if (!reply) {
      return NextResponse.json(
        { error: "Empty response from OpenAI" },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Unexpected error while contacting OpenAI" },
      { status: 500 },
    );
  }
}
