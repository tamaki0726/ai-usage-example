export type SampleDocument = {
  id: string;
  title: string;
  type: "pdf" | "markdown" | "faq" | "policy";
  source: string;
  content: string;
};

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: "onboarding-guide",
    title: "導入オンボーディング手順書（抜粋）",
    type: "pdf",
    source: "docs/onboarding-guide.pdf",
    content:
      "CloudWork Manager を新規導入する際の社内標準手順。初期設定では SSO と監査ログを有効化し、アカウント種別ごとに最小権限ロールを割り当てる。ワークフロー承認経路は申請・承認・最終承認の3段階を基本とし、Slack 通知をオプションで有効化できる。",
  },
  {
    id: "billing-policy",
    title: "課金・請求ポリシー v1.4",
    type: "policy",
    source: "handbook/billing-policy.md",
    content:
      "料金は月次従量制。基本料金は1テナントあたり固定、追加はアクティブユーザー数に基づく。締め日は毎月末、請求書は翌月5営業日以内にメール送付。支払い遅延が3営業日を超えると自動で閲覧専用モードへ移行する。エンタープライズ契約では前倒し請求と分割払いのオプションがある。",
  },
  {
    id: "backup-drill",
    title: "バックアップ & DR 計画（サマリ）",
    type: "markdown",
    source: "runbook/backup-and-dr.md",
    content:
      "本番データベースは15分間隔で PITR を有効化し、S3 へ日次スナップショットを保管する。障害発生時は RPO 15分以内、RTO 60分以内を目標とし、代替リージョンへのフェイルオーバー手順を runbook に記載。アプリ層は IaC で再構築し、障害報告はステータスページへ即時掲載する。",
  },
  {
    id: "security-baseline",
    title: "セキュリティ基準（社内公開版）",
    type: "policy",
    source: "security/security-baseline.md",
    content:
      "管理者アカウントは MFA 必須。監査ログを90日保持し、API キーは最低限の権限スコープで発行する。顧客データの持ち出しは禁止で、検証環境には匿名化データのみを使用する。個人情報を含むエクスポートは承認フローを通過した申請のみ許可する。",
  },
  {
    id: "slack-runbook",
    title: "障害時のSlack連絡テンプレート",
    type: "markdown",
    source: "runbook/incident-comm-template.md",
    content:
      "障害検知時は #incidents に以下を投稿: (1) 発生時刻 (2) 影響範囲 (3) 初期トリアージ結果 (4) 回避策の有無。15分ごとにアップデートを追記し、主要顧客にはCS経由でメール連絡する。",
  },
  {
    id: "slo-metrics",
    title: "SLO & エラーバジェット方針",
    type: "policy",
    source: "handbook/slo-policy.md",
    content:
      "APIレイテンシP95 800ms以下、成功率99.9%をSLOとする。30日間のエラーバジェットを消費した場合、新規リリースを凍結し、バグ修正と信頼性改善を最優先にする。SLO違反時はPostmortemを48時間以内に公開。",
  },
  {
    id: "pii-handling",
    title: "個人情報取扱いガイド",
    type: "policy",
    source: "security/pii-handling.md",
    content:
      "個人情報は暗号化されたストレージで保管し、アクセスは監査ログに記録する。サポート対応時のログ共有は匿名化済みの形で行う。検証環境ではダミーデータのみ使用し、スクリーンショット共有時も氏名やメールをマスクする。",
  },
  {
    id: "api-usage",
    title: "API 利用ベストプラクティス",
    type: "faq",
    source: "docs/api-best-practices.md",
    content:
      "APIキーは役割ごとに分割し、最小権限で発行する。Webhookの再試行は指数バックオフで最大5回。大規模エクスポートはジョブAPIを使い、完了通知をWebhookで受け取る。レートリミット超過時はRetry-Afterヘッダーを確認する。",
  },
  {
    id: "data-retention",
    title: "データ保持と削除ポリシー",
    type: "policy",
    source: "handbook/data-retention.md",
    content:
      "システムログは90日、監査ログは180日保持。ユーザー削除は30日間の猶予期間後に完全削除される。エクスポートデータは7日以内に失効する一時URLで提供し、バックアップからの個別復元はオンコール承認が必要。",
  },
  {
    id: "sso-setup",
    title: "SSO設定チェックリスト",
    type: "pdf",
    source: "docs/sso-setup.pdf",
    content:
      "IdPにはSAML 2.0で接続し、NameIDはemailを使用。初回ログイン時にロールマッピングを実行し、管理者にはMFAを強制する。SCIMを有効化して自動プロビジョニングを行い、定期的にデプロビジョニングジョブの結果を確認する。",
  },
] as const;
