# CLAUDE.md

このファイルは、このリポジトリで作業する際の Claude Code 向けガイドです。

## プロジェクト概要

メタバースプラットフォーム [cluster](https://cluster.mu/) の「トリガー」機能用 JSON ファイルを GUI で生成・編集する Web ツール。すべての処理はブラウザ内で完結するクライアントサイド SPA で、サーバーは静的配信のみを担う。本番は Vercel（https://cluster-trigger.tool.waramochi.com/）。

## コマンド

```bash
pnpm install   # 依存関係のインストール
pnpm dev       # 開発サーバー（http://localhost:3000）
pnpm build     # 本番ビルド
pnpm start     # 本番サーバー
pnpm tsc       # 型チェック（tsc --noEmit 相当）
pnpm lint      # ESLint
```

- パッケージマネージャーは **pnpm 固定**（`packageManager: pnpm@10.6.4`）。npm / yarn は使わない。
- テストフレームワークは未導入。

## アーキテクチャ

Next.js (Pages Router) + React 19 + TypeScript。状態管理は Formik、UI は Material UI + Emotion。

データフローは一方向：**Formik の状態 → UI → ユーザー入力 → Formik アクション → 状態更新**。グローバルな状態管理ライブラリは使っていない。

### 中心となる型とデータ変換

- `src/types/Trigger.ts` — 全データモデル。`Trigger` / `TriggerState`（`bool` / `integer` / `float` / `signal` の判別共用体）/ `TriggerColor` / `JsonFormat`。
- `src/encoder/json.ts` — アプリ内部の `Trigger[]` と出力用 `JsonFormat` の相互変換。
  - `triggersToTriggerJsonText`: `Trigger[]` → JSON 文字列（エクスポート）
  - `triggerJsonTextToTriggers`: `JsonFormat` → `Trigger[]`（インポート）

**注意すべき非自明な仕様**:
- **色の表現が内部と外部で異なる**。内部（`TriggerColor`）は r/g/b を 0〜256 の整数で持つが、JSON 出力時は各値を 256 で割って 0.0〜1.0 に変換し、インポート時は逆変換する。色を扱う際はこの変換を必ず意識すること。
- `state` は `type` によって持つフィールドが変わる判別共用体。`signal` のみ `value` を持たない。型を追加・変更する際は `Trigger.ts` の共用体と `json.ts` の両方の `switch` を更新する（`default` で `throw` している）。

### コンポーネント構成

```
TriggerTool (index.tsx)
├── Header
├── EditForm (editForm/index.tsx)   ← Formik のルート。インポート/エクスポートのボタンもここ
│   └── TriggerCard                  ← 個々のトリガー（FieldArray でリスト管理）
│       └── State                    ← 個々の状態（同じく FieldArray）
└── Footer
```

- トリガー/状態の追加・削除・移動・複製はすべて Formik の `FieldArray` ヘルパー（`push` / `remove` / `swap` / `insert`）で行う。
- インポートは `EditForm` 内で動的に `<input type="file">` を生成 → `FileReader` で読み込み → `setInitialValues`（`enableReinitialize` で反映）。エクスポートは `src/utils/download.ts` の `download` 関数で Blob をダウンロード。

### 分析トラッキング

`src/utils/analytics/index.ts` の `sendTrackingEvent(label)` が `window.gtag` を呼ぶ。トリガー/状態の追加・削除・移動・複製、インポート/エクスポートなど主要操作で呼び出している。新しいユーザー操作を追加したら、既存の慣習に合わせてトラッキングを入れることを検討する。

## 拡張時のチェックポイント

新しいトリガー型や属性を追加する場合、最低限以下を揃える：
1. `src/types/Trigger.ts` の型定義
2. `src/encoder/json.ts` のエンコード/デコード両方
3. 対応する UI コンポーネント（`TriggerCard` / `State`）

## メモリバンク

`cline_docs/memory-bank/` に背景・設計・進捗の詳細メモがある（productContext / systemPatterns / techContext など）。プロジェクトの「なぜ」を知りたいときの参照先。

⚠️ ただし `techContext.md` のバージョン記述（Next.js v12、React v17 等）は古く、実際は `package.json` のとおり Next.js 15 / React 19。バージョンは常に `package.json` を正とすること。
