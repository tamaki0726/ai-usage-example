"use client";

import { useState } from "react";

const sampleMail = `件名: 納期変更のご相談

いつもお世話になっております。株式会社アオイ物流の佐藤です。
7/18に出荷予定の「CW-8142」ですが、台風の影響で輸送が2日遅れる見込みです。
納品日を7/22に変更したいのですが、社内の締め処理に影響が出るため、
代替案があれば教えていただけますでしょうか。`;

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
};

const highlightStats = [
  { label: "初動時間", value: "平均 6分", note: "AIが一次案を自動生成" },
  { label: "要約精度", value: "92%", note: "過去メール1.2万件で検証" },
  { label: "工数削減", value: "-38%", note: "繁忙期の返信作業を短縮" },
];

const workflowSteps = [
  {
    title: "受信メールを貼り付け",
    detail: "Gmail / Zendesk / Outlook から本文をコピペ",
  },
  {
    title: "要点を自動抽出",
    detail: "期限・依頼・感情トーンをタグ化して整理",
  },
  {
    title: "返信案を生成",
    detail: "過去の対応履歴とポリシーに合わせて作成",
  },
  {
    title: "人が確認して送信",
    detail: "重要表現や条件をレビューして即送信",
  },
];

const toneGuides = [
  { label: "トーン", value: "丁寧 / 安心感" },
  { label: "署名", value: "担当名 + 直通連絡先" },
  { label: "禁則", value: "値引き・約束は人が承認" },
];

export default function MailPage() {
  const [emailBody, setEmailBody] = useState(sampleMail);
  const [result, setResult] = useState<MailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!emailBody.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailBody }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unexpected error");
      }

      const data = (await response.json()) as MailResponse;
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        "メール生成に失敗しました。OPENAI_API_KEYの設定やリクエスト制限をご確認ください。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2ff_40%,_#fff_70%)] px-6 py-16 text-slate-900">
      <main className="mx-auto flex max-w-6xl flex-col gap-12">
        <header className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm">
            AI Email Composer
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">
                AI導入事例
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                AIで顧客対応メール・文章を自動生成
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                受信したメールを貼り付けるだけで、要点の要約と返信文を同時に作成。
                社内ポリシーに沿ったトーンで一次案を提示し、担当者は確認して送るだけです。
              </p>
            </div>
            <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-3">
              {highlightStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-sm shadow-lg shadow-indigo-100"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-2xl shadow-indigo-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                  受信メール
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  メール本文を貼り付け
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-500"
                onClick={() => {
                  setEmailBody(sampleMail);
                  setResult(null);
                }}
              >
                サンプルを挿入
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-inner">
              <label className="text-xs font-semibold text-slate-700">
                本文
              </label>
              <textarea
                className="mt-2 min-h-[200px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                value={emailBody}
                onChange={(event) => {
                  setEmailBody(event.target.value);
                  setResult(null);
                }}
                placeholder="例: お問い合わせ内容や依頼文を貼り付け"
              />
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                {toneGuides.map((guide) => (
                  <span
                    key={guide.label}
                    className="rounded-full border border-dashed border-slate-200 bg-slate-50 px-3 py-1"
                  >
                    {guide.label}: {guide.value}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!emailBody.trim() || isLoading}
                className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "生成中..." : "要点と返信を生成"}
              </button>
              {error ? (
                <span className="text-xs text-rose-600">{error}</span>
              ) : (
                <span className="text-xs text-slate-500">
                  生成結果は社内ポリシーに基づく下書きです
                </span>
              )}
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-4 shadow-inner">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                    要点要約
                  </p>
                  <span className="rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs text-indigo-500">
                    {result?.summary.priority ?? "未生成"}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {result?.summary.headline ?? "生成待ちです"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {result?.summary
                    ? `トーン: ${result.summary.sentiment}`
                    : "生成すると感情トーンも判定します"}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {(result?.summary.points ?? [
                    "要点を抽出してここに表示します",
                    "期限や要望をタグ化",
                    "優先度の目安を提示",
                  ]).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                  {(result?.summary.actions ?? [
                    "次アクションを提案",
                    "CRMチケットを自動作成",
                  ]).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                  返信文 (ドラフト)
                </p>
                <div className="mt-2 min-h-[160px] whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-sm leading-relaxed text-slate-700">
                  {result?.reply
                    ? result.reply
                    : "メールを貼り付けて生成すると、返信文がここに表示されます。"}
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-2xl shadow-indigo-100">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                導入フロー
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                4ステップで定着
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {workflowSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 shadow-inner"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                      Step {index + 1}
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {step.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-2xl shadow-indigo-100">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                運用ポイント
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                品質と安全性を両立
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>センシティブ情報は自動マスクして入力</li>
                <li>重要条件はルールベースで赤字ハイライト</li>
                <li>担当者承認後に送信ログを自動保存</li>
                <li>FAQ / SLA と連動した返信テンプレート</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-6 shadow-2xl shadow-indigo-100">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                導入効果
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                応対品質が均一化
              </h3>
              <p className="mt-3 text-sm text-slate-700">
                新人でも過去のベスト返信に近い文章を即座に提示できるため、対応のばらつきが減少。
                マネージャーは難易度の高い案件に集中できます。
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  監査ログ: 自動保存
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  業界辞書: 450語
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  同時処理: 150通/時
                </span>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
