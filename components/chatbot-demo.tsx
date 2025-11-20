"use client";

import { useMemo, useState } from "react";

type Message = {
  role: "user" | "bot";
  content: string;
};

const COMPANY_NAME = "株式会社スカイリンクソフト";
const SERVICE_NAME = "CloudWork Manager";

const BOT_GREETING =
  "株式会社スカイリンクソフト サポートデスクです。ご用件をお聞かせください。";

export function ChatbotDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: BOT_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const suggestedPrompts = useMemo(
    () => [
      "請求書をもう一度送ってほしい",
      "アカウントを追加する方法を教えてください",
      "支払い方法の変更について",
    ],
    [],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || isThinking) return;

    const nextMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, nextMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/support-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: nextMessage.content,
          history: [...messages, nextMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach support endpoint");
      }

      const data = (await response.json()) as { reply?: string };
      const reply =
        data.reply ??
        "社内ナレッジを確認中です。少々時間をおいてから再度お試しください。";

      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "大変申し訳ありません。現在AI応答が混み合っています。support@skylinksoft.jp へメールでご連絡ください。",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (isThinking) return;
    setInput(prompt);
  };

  return (
    <section className="w-full rounded-3xl border border-slate-100 bg-white/95 shadow-2xl shadow-blue-100 backdrop-blur">
      <div className="flex flex-col gap-5 p-6">
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 font-semibold text-white">
              CM
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
                {COMPANY_NAME} SUPPORT
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {SERVICE_NAME} バーチャル窓口
              </p>
              <p className="text-xs text-slate-500">
                このチャットは自動で記録されます
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            FAQや障害情報と連動した一次応対チャットです。営業時間外でも
            AIが内容を整理し、担当サポートへ引き継ぎます。
          </p>
        </header>

        <div className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-gradient-to-b from-white via-slate-50 to-slate-100 p-5 shadow-inner">
          <div className="flex flex-col gap-4 overflow-y-auto text-sm sm:h-80">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed shadow ${message.role === "user"
                    ? "bg-sky-600 text-white shadow-sky-200"
                    : "bg-white/90 text-slate-800 border border-slate-100 shadow-slate-200"
                    }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
                応答を作成しています...
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100">
              <input
                className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
                placeholder="例: 管理画面にログインできなくなった"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <button
                type="submit"
                className="rounded-full bg-sky-500 px-4 py-1 text-white transition hover:bg-sky-600 disabled:opacity-50"
                disabled={isThinking || !input.trim()}
              >
                送信
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-full border border-dashed border-sky-200 px-3 py-1 text-sky-600 transition hover:border-sky-300 hover:text-sky-700"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4 text-xs text-slate-700">
          <p className="font-semibold text-sky-700">ご案内:</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-600">
            <li>平日 10:00-18:00 は担当オペレーターへ手動で引き継ぎます。</li>
            <li>添付ファイルが必要な場合は、受信メールに返信する形でお送りください。</li>
            <li>{SERVICE_NAME}のステータスは status.cloudworkmanager.jp でも確認できます。</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
