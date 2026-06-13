# Cluster Trigger Tool

メタバースプラットフォーム [cluster](https://cluster.mu/) の「トリガー」機能で使う JSON ファイルを、GUI で簡単に生成・編集できる Web ツールです。

JSON を手書きすることなく、フォーム上でトリガーや状態（state）を設定し、有効な JSON としてエクスポートできます。既存の JSON を読み込んで編集することも可能です。

🔗 **公開 URL**: https://warabi1062.github.io/cluster_trigger_tool/

## 主な機能

- **トリガーの作成・編集**: 表示名・カテゴリー・確認ダイアログの表示有無・色を設定
- **状態（state）の管理**: `bool` / `integer` / `float` / `signal` の各型に対応した状態の追加・編集・削除
- **並べ替え・複製**: トリガーや状態を上下に移動、ワンクリックで複製
- **JSON エクスポート**: 設定内容を `trigger.json` としてダウンロード
- **JSON インポート**: 既存の JSON ファイルを読み込んでフォームに反映
- **クライアントサイド完結**: すべての処理はブラウザ内で行われ、ファイルがサーバーに送信されることはありません

## 技術スタック

- [Next.js](https://nextjs.org/) (Pages Router) / [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/) + [Emotion](https://emotion.sh/)（CSS-in-JS）
- [Formik](https://formik.org/)（フォーム状態管理）
- [react-color](https://casesandberg.github.io/react-color/)（カラーピッカー）
- ESLint / Prettier / pnpm

## セットアップ

### 必要条件

- Node.js
- pnpm（`packageManager` フィールドで `pnpm@10.6.4` を指定）

### インストールと起動

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動（http://localhost:3000）
pnpm dev
```

### ビルド（静的書き出し）

このアプリは `output: "export"` による静的サイトとしてビルドされ、`out/` ディレクトリに HTML/CSS/JS が出力されます。

```bash
# 静的書き出し（out/ に生成）
pnpm build

# GitHub Pages と同じパス構成（/cluster_trigger_tool 配下）でビルドする場合
GITHUB_PAGES=true pnpm build
```

`GITHUB_PAGES=true` のときのみ `basePath` / `assetPrefix` に `/cluster_trigger_tool` が付与されます。ローカル開発（`pnpm dev`）やデフォルトの `pnpm build` ではルート配信になります。

### その他のコマンド

```bash
pnpm tsc    # 型チェック
pnpm lint   # ESLint によるチェック
```

## 出力される JSON の仕様

エクスポートされる JSON は次の構造を持ちます。

```json
{
  "triggers": [
    {
      "displayName": "表示名",
      "category": "カテゴリー",
      "showConfirmDialog": false,
      "color": [1.0, 1.0, 1.0],
      "state": [
        { "key": "exampleSignal", "type": "signal" },
        { "key": "exampleBool", "type": "bool", "value": true },
        { "key": "exampleInt", "type": "integer", "value": 1 },
        { "key": "exampleFloat", "type": "float", "value": 1.5 }
      ]
    }
  ]
}
```

| フィールド | 説明 |
| --- | --- |
| `displayName` | トリガーの表示名 |
| `category` | カテゴリー（省略可） |
| `showConfirmDialog` | 実行時に確認ダイアログを表示するか |
| `color` | RGB を 0.0〜1.0 で表した配列（省略可）。ツール内部では 0〜256 の値で扱い、入出力時に変換します |
| `state` | トリガーが操作する状態の配列 |

`state` の各要素は `type` によって持つフィールドが変わります。

- `signal`: `key`, `type` のみ
- `bool`: `key`, `type`, `value`（真偽値）
- `integer` / `float`: `key`, `type`, `value`（数値）

## ディレクトリ構成

```
.
├── pages/                      # Next.js のページ（Pages Router）
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
├── public/                     # 静的アセット
├── src/
│   ├── component/triggerTool/  # トリガーツールの UI コンポーネント
│   │   ├── editForm/           #   編集フォーム（TriggerCard / State）
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── index.tsx
│   ├── encoder/json.ts         # Trigger ⇔ JSON の変換ロジック
│   ├── types/Trigger.ts        # 型定義
│   └── utils/download.ts       # ファイルダウンロード
├── .github/workflows/          # GitHub Actions（Pages デプロイ）
└── cline_docs/memory-bank/     # プロジェクトのメモリバンク（背景・設計メモ）
```

## デプロイ

`main` ブランチへの push をトリガーに、GitHub Actions（`.github/workflows/deploy.yml`）で静的書き出し（`GITHUB_PAGES=true pnpm build`）を行い、生成された `out/` を **GitHub Pages** に公開します。

### 初回セットアップ

リポジトリの **Settings → Pages → Build and deployment → Source** を **「GitHub Actions」** に設定してください。以降は `main` への push で自動デプロイされます。
