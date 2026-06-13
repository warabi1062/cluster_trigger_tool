# CLAUDE.md

このファイルは、このリポジトリで作業する際の Claude Code 向けガイドです。

## プロジェクト概要

メタバースプラットフォーム [cluster](https://cluster.mu/) の「トリガー」機能用 JSON ファイルを GUI で生成・編集する Web ツール。すべての処理はブラウザ内で完結するクライアントサイド SPA。`output: "export"` で静的サイトとして書き出し、**GitHub Pages**（https://warabi1062.github.io/cluster_trigger_tool/）で公開する。

## コマンド

```bash
pnpm install   # 依存関係のインストール
pnpm dev       # 開発サーバー（http://localhost:3000）
pnpm build     # 静的書き出し（out/ に生成）
pnpm tsc       # 型チェック（tsc --noEmit 相当）
pnpm lint      # ESLint
```

- パッケージマネージャーは **pnpm 固定**（`packageManager: pnpm@10.6.4`）。npm / yarn は使わない。
- テストフレームワークは未導入。
- `next start`（Node サーバー）は使わない。静的書き出し前提のため。

## デプロイ（GitHub Pages）

`main` への push で `.github/workflows/deploy.yml` が走り、`GITHUB_PAGES=true pnpm build` → `out/` を Pages に公開する。

**非自明な挙動 — basePath の出し分け**:
- GitHub Pages はプロジェクトページ（`/cluster_trigger_tool` 配下）配信なので `basePath` / `assetPrefix` が必要。
- `next.config.mjs` は環境変数 `GITHUB_PAGES=true` のときだけ basePath を付与し、ローカル開発・デフォルトビルドではルート配信にする。
- `next/link` / `next/image` は basePath を自動付与するが、**手書きの絶対パス（favicon 等）には付かない**。そのため `next.config.mjs` で basePath を `NEXT_PUBLIC_BASE_PATH` として公開し、`_document.tsx` の favicon パスに自前で前置している。新たに手書きの絶対パスを足すときは同じく前置すること。

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
- スタイリングの `styled` は **`@mui/material/styles` から import** する（`@mui/system` の `styled` は ThemeProvider の palette 付きテーマを解決できず実行時エラーになる）。テンプレート内でテーマを使うときは `${({ theme }) => ...}` 形式で受け取る。

## 拡張時のチェックポイント

新しいトリガー型や属性を追加する場合、最低限以下を揃える：
1. `src/types/Trigger.ts` の型定義
2. `src/encoder/json.ts` のエンコード/デコード両方
3. 対応する UI コンポーネント（`TriggerCard` / `State`）

## メモリバンク

`cline_docs/memory-bank/` に背景・設計・進捗の詳細メモがある（productContext / systemPatterns / techContext など）。プロジェクトの「なぜ」を知りたいときの参照先。

⚠️ ただし `techContext.md` のバージョン記述や「Vercel にデプロイ」等は古く、実態とずれている（実際は Next.js 16 / React 19、デプロイ先は GitHub Pages）。バージョン・構成は常に `package.json` と本ファイルを正とすること。
