"use client";

import { useMemo, useState } from "react";
import { SAMPLE_DOCUMENTS } from "../../lib/rag-sample-docs";

type RetrievedChunk = {
  id: string;
  title: string;
  source: string;
  type: "pdf" | "markdown" | "faq" | "policy";
  score: number;
  snippet: string;
};

type RagResponse = {
  answer: string;
  retrieved: RetrievedChunk[];
  model: string;
  embeddingModel: string;
};

const steps = [
  {
    title: "1. ドキュメント収集",
    detail: "PDF / Markdown / FAQ を投入。社内で公開できるものから小さく始める。",
  },
  {
    title: "2. 分割 & ベクトル化",
    detail: "チャンク化して OpenAI Embeddings でベクトル化。pgvector などへ保存。",
  },
  {
    title: "3. 近傍検索",
    detail: "質問をベクトル化し、cosine 類似度で上位チャンクを取得。",
  },
  {
    title: "4. コンテキスト付き生成",
    detail: "関連チャンクをプロンプトに添付し、LLM で回答を生成。",
  },
];

export default function RagPlaygroundPage() {
  const [question, setQuestion] = useState("バックアップのRPOとRTOの目標値を教えて");
  const [topK, setTopK] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RagResponse | null>(null);

  const docStats = useMemo(() => {
    const counts = SAMPLE_DOCUMENTS.reduce<Record<string, number>>((acc, doc) => {
      acc[doc.type] = (acc[doc.type] ?? 0) + 1;
      return acc;
    }, {});
    return counts;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/rag-playground", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, topK }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unexpected error");
      }

      const data = (await response.json()) as RagResponse;
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        "RAGの呼び出しに失敗しました。OPENAI_API_KEYの設定やリクエスト制限をご確認ください。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50 px-6 py-16 text-slate-900">
      <main className="mx-auto flex max-w-6xl flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-600 shadow-sm">
            RAG Proof of Concept
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-slate-900">
                CloudWork Manager RAG 検証ページ
              </h1>
              <p className="text-sm text-slate-600">
                社内ドキュメントを元にした Retrieval-Augmented Generation の PoC です。
                シンプルなフローで埋め込み → 検索 → 回答生成の動きを確認できます。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-xs text-slate-600 shadow">
              <p className="font-semibold text-slate-900">利用モデル</p>
              <p className="mt-1">Embedding: text-embedding-3-small</p>
              <p>Generation: gpt-4o-mini</p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-2xl shadow-sky-100 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step.title} className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
                {step.title}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{step.detail}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-2xl shadow-sky-100">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">
                  Playground
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">質問してみる</h2>
              </div>
              <div className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                TopK: {topK}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-inner">
                <label className="text-xs font-semibold text-slate-700">
                  ユーザーの質問
                </label>
                <textarea
                  className="min-h-[90px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="例: 課金遅延時にどういう制限がかかりますか？"
                />
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <label className="flex items-center gap-2">
                    <span>TopK (類似チャンク数)</span>
                    <input
                      type="number"
                      min={1}
                      max={SAMPLE_DOCUMENTS.length}
                      value={topK}
                      onChange={(event) => setTopK(Number(event.target.value))}
                      className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>
                  <span className="rounded-full border border-dashed border-slate-200 bg-slate-50 px-3 py-1">
                    サンプルDoc: {SAMPLE_DOCUMENTS.length}件
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => setQuestion("課金・請求の締め日と支払い遅延時の扱いをまとめて")}
                  className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-sky-700 transition hover:border-sky-200 hover:text-sky-800"
                >
                  請求ポリシーを聞く
                </button>
                <button
                  type="button"
                  onClick={() => setQuestion("バックアップ失敗時の復旧フローは？")}
                  className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-sky-700 transition hover:border-sky-200 hover:text-sky-800"
                >
                  DR 計画を聞く
                </button>
                <button
                  type="button"
                  onClick={() => setQuestion("セキュリティポリシー上のデータ持ち出し可否を教えて")}
                  className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-sky-700 transition hover:border-sky-200 hover:text-sky-800"
                >
                  セキュリティを聞く
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:opacity-60"
                >
                  {isLoading ? "検索中..." : "RAGで回答を生成"}
                </button>
                {error ? (
                  <span className="text-sm text-rose-600">{error}</span>
                ) : null}
              </div>
            </form>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 shadow-inner">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
                  回答
                </p>
                <div className="mt-2 min-h-[100px] whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {result?.answer ?? "まだ実行していません。質問を入力して実行してください。"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
                    参照したチャンク
                  </p>
                  <p className="text-xs text-slate-500">
                    cosine 類似度順 / 上位 {result?.retrieved.length ?? topK} 件
                  </p>
                </div>
                <div className="mt-3 grid gap-3">
                  {result?.retrieved?.length ? (
                    result.retrieved.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-sm text-slate-800"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="rounded-full bg-white px-2 py-1 font-semibold text-slate-800">
                            {item.title}
                          </span>
                          <span className="rounded-full border border-slate-200 px-2 py-1">
                            {item.type}
                          </span>
                          <span className="rounded-full border border-slate-200 px-2 py-1">
                            score: {item.score}
                          </span>
                          <span className="rounded-full border border-dashed border-slate-200 px-2 py-1">
                            {item.source}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-700">
                          {item.snippet}
                          {item.snippet.length >= 420 ? "..." : ""}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">
                      まだ検索結果がありません。
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-2xl shadow-sky-100">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">
                サンプルドキュメント
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                インデックス対象 (ダミー)
              </h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  pdf: {docStats.pdf ?? 0}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  markdown: {docStats.markdown ?? 0}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  policy: {docStats.policy ?? 0}
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {SAMPLE_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 shadow-inner"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-white px-2 py-1 font-semibold text-slate-800">
                        {doc.title}
                      </span>
                      <span className="rounded-full border border-slate-200 px-2 py-1">
                        {doc.type}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-700">
                      {doc.content}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-500">
                      収集元: {doc.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-xl shadow-sky-100 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
                次の一歩
              </p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>pgvector / Supabase などの実データベースに置き換える</li>
                <li>チャンクサイズとオーバーラップを調整し回答精度を比較</li>
                <li>社内権限に応じたフィルタリング（Row Level Security）を追加</li>
                <li>回答引用元へのリンク表示を拡張し、トレーサビリティを確保</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
