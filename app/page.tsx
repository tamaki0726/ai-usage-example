import { ChatbotDemo } from "../components/chatbot-demo";

const supportMetrics = [
  {
    label: "稼働状況",
    value: "通常運転",
    note: "直近24時間は障害なし",
  },
  {
    label: "平均初動",
    value: "15分",
    note: "SLA: 60分以内に一次回答",
  },
  {
    label: "営業時間",
    value: "平日 10:00-18:00",
    note: "夜間はAIチャットで受付",
  },
];

const contactChannels = [
  {
    title: "電話サポート",
    detail: "050-3188-0456",
    description: "IVRで「2」を押してCloudWork Manager窓口にお繋ぎください。",
    meta: "契約管理者専用 / 平日 10:00-18:00",
    link: "tel:05031880456",
  },
  {
    title: "メール・チケット",
    detail: "support@skylinksoft.jp",
    description: "24時間受付。平均3時間で回答し、全履歴をCRMに保存します。",
    meta: "Ccに success@skylinksoft.jp を含めるとCSチームにも共有されます。",
    link: "mailto:support@skylinksoft.jp",
  },
  {
    title: "Slack Connect",
    detail: "@cloudwork-support",
    description: "Enterpriseプランのお客様は専用チャンネルからSREへ直接連絡できます。",
    meta: "平日 9:00-21:00 / 障害時は24時間オンコール",
  },
  {
    title: "稼働状況ページ",
    detail: "status.cloudworkmanager.jp",
    description: "最新のメンテナンス予定・障害報告をリアルタイムで公開しています。",
    meta: "RSS・Webhook配信にも対応",
  },
];

const announcements = [
  {
    date: "2024/08/30",
    label: "メンテナンス",
    message:
      "9/4(水) 23:00-24:00に管理画面の計画メンテナンスを実施します。処理中のジョブは順次再開されます。",
  },
  {
    date: "2024/08/18",
    label: "インシデント",
    message:
      "BIエクスポートの遅延が一部テナントで発生しました（21:10に解消済み）。対象組織には個別メールをお送りしました。",
  },
  {
    date: "2024/08/05",
    label: "セキュリティ",
    message:
      "管理者アカウントの多要素認証を必須化しました。設定手順は管理画面のお知らせをご覧ください。",
  },
];

const faqItems = [
  {
    question: "契約IDや組織番号はどこで確認できますか？",
    answer:
      "管理画面 > 組織設定 に表示される「CW-」から始まる番号が契約IDです。お問い合わせ時にお知らせください。",
  },
  {
    question: "オペレーターにつないでもらうにはどうすれば良いですか？",
    answer:
      "チャットの最後に「担当者と話したい」と入力いただくか、営業時間内にお電話ください。会話履歴は担当者に共有されます。",
  },
  {
    question: "添付ファイルを送りたい",
    answer:
      "チャット受付後に自動配信される受付メールへ返信する形でファイルを添付してください。最大25MBまで対応しています。",
  },
];

const preparationChecklist = [
  "組織ID（CW-で始まる7桁）",
  "発生日時と再現手順",
  "影響ユーザー数や環境（ブラウザ・端末）",
  "可能であればスクリーンショットやログ",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 px-6 py-16 text-slate-900">
      <main className="mx-auto flex max-w-6xl flex-col gap-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-stretch">
          <div className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-blue-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-xl font-semibold text-white">
                CM
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                  株式会社スカイリンクソフト サポートデスク
                </p>
                <h1 className="text-3xl font-semibold text-slate-900">
                  CloudWork Manager お問い合わせ窓口
                </h1>
                <p className="text-sm text-slate-500">
                  契約者さま専用 / 受付番号はメールでご案内します
                </p>
              </div>
            </div>

            <p className="text-base leading-relaxed text-slate-600">
              請求・アカウント・システム不具合など、CloudWork Managerに関するサポート依頼をまとめて受け付けています。
              チャットは24時間稼働しており、営業時間内は担当オペレーターが即時に会話へ参加します。
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {supportMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-sky-500">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {metric.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <a
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-sky-600 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
                href="tel:05031880456"
              >
                電話する (050-3188-0456)
              </a>
              <a
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
                href="mailto:support@skylinksoft.jp"
              >
                メールで連絡
              </a>
              <span className="flex items-center rounded-full border border-dashed border-slate-300 px-4 py-2 text-xs text-slate-500">
                チャット受付は24時間 / 案件番号自動発行
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/90 p-5 text-sm leading-relaxed shadow-sm">
              <p className="font-semibold text-slate-900">
                ご相談いただける主な内容
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
                <li>ご契約・請求・プラン変更、ユーザー/権限の管理</li>
                <li>API連携、ワークフロー、監査ログなど技術質問</li>
                <li>システム障害、パフォーマンス低下、データ復旧相談</li>
              </ul>
            </div>
          </div>

          <ChatbotDemo />
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl shadow-blue-100">
          <div className="mb-8 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
              連絡手段
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              状況に応じたサポートチャネルをお選びください
            </h2>
            <p className="text-sm text-slate-500">
              重要度にかかわらず、すべてのお問い合わせはチケット化されステータスを追跡できます。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {contactChannels.map((channel) => (
              <div
                key={channel.title}
                className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white/90 p-5 shadow"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-slate-900">
                    {channel.title}
                  </p>
                  {channel.link ? (
                    <a
                      className="text-sm font-medium text-sky-500 hover:text-sky-600"
                      href={channel.link}
                    >
                      開く
                    </a>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-sky-600">{channel.detail}</p>
                <p className="mt-3 flex-1 text-sm text-slate-600">
                  {channel.description}
                </p>
                <p className="mt-4 text-xs text-slate-500">
                  {channel.meta}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-2xl shadow-blue-100">
            <div className="mb-6 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                お知らせ
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                最新のメンテナンス・障害情報
              </h3>
            </div>
            <div className="space-y-4">
              {announcements.map((item) => (
                <article
                  key={item.message}
                  className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="font-semibold text-sky-500">
                      {item.label}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {item.message}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-2xl shadow-blue-100">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                FAQ
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                よくあるご質問
              </h3>
              <div className="mt-6 space-y-5 text-sm text-slate-700">
                {faqItems.map((faq) => (
                  <div key={faq.question}>
                    <p className="font-semibold text-slate-900">
                      {faq.question}
                    </p>
                    <p className="mt-1 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-2xl shadow-blue-100">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                事前にご準備ください
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
                {preparationChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                情報が揃っていると調査が迅速になり、平均対応時間が40%短縮されます。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
