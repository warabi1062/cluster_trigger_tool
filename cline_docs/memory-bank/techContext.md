# 技術コンテキスト: Cluster Trigger Tool

## 技術スタック概要

### フロントエンド
- **Next.js (v12.0.3)**: Reactベースのフレームワーク
- **React (v17.0.2)**: UIライブラリ
- **TypeScript (v4.4.4)**: 型安全な JavaScript
- **Material UI (v5.2.6)**: UIコンポーネントライブラリ
- **Emotion (v11.7.1)**: CSS-in-JSライブラリ
- **Formik (v2.2.9)**: フォーム管理ライブラリ
- **React Color (v2.19.3)**: カラーピッカーコンポーネント

### 開発ツール
- **ESLint (v7)**: コード品質とスタイルのチェック
- **Prettier (v2.4.1)**: コードフォーマッター
- **pnpm (v10.6.4)**: パッケージマネージャー

## プロジェクト構造

```
/
├── pages/                  # Next.jsのページコンポーネント
│   ├── _app.tsx            # アプリケーションのエントリーポイント
│   ├── _document.tsx       # HTMLドキュメント構造
│   └── index.tsx           # メインページ
├── public/                 # 静的アセット
├── src/
│   ├── component/          # Reactコンポーネント
│   │   └── triggerTool/    # トリガーツール関連コンポーネント
│   │       ├── editForm/   # 編集フォーム関連コンポーネント
│   │       ├── Footer.tsx  # フッターコンポーネント
│   │       ├── Header.tsx  # ヘッダーコンポーネント
│   │       └── index.tsx   # メインコンポーネント
│   ├── encoder/            # データエンコーディング
│   │   └── json.ts         # JSON変換ロジック
│   ├── types/              # TypeScript型定義
│   │   └── Trigger.ts      # トリガー関連の型定義
│   └── utils/              # ユーティリティ関数
│       ├── download.ts     # ファイルダウンロード機能
│       └── analytics/      # 分析トラッキング
├── next.config.js          # Next.js設定
├── tsconfig.json           # TypeScript設定
└── package.json            # プロジェクト依存関係
```

## 主要な依存関係と役割

### UI関連
- **Material UI**: アプリケーション全体のUIコンポーネント（ボタン、テキストフィールド、カードなど）を提供
- **Emotion**: スタイリングソリューションとして使用され、コンポーネントのスタイルをJavaScriptで定義
- **React Color**: カラーピッカーコンポーネントを提供し、トリガーの色選択に使用

### フォーム管理
- **Formik**: 複雑なフォーム状態、バリデーション、送信処理を管理

### ファイル操作
- **FileReader API**: JSONファイルのインポートに使用
- **download.ts**: ブラウザでのファイルダウンロード機能を提供

### 分析
- **analytics/index.ts**: ユーザーアクションのトラッキングを処理

## 開発環境のセットアップ

### 必要条件
- Node.js (v14以上推奨)
- pnpm (v6以上)

### 開発サーバーの起動
```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

### ビルドと本番環境
```bash
# 本番用ビルド
pnpm build

# 本番サーバーの起動
pnpm start
```

## 技術的制約と考慮事項

### ブラウザ互換性
- モダンブラウザ（Chrome、Firefox、Safari、Edge）をサポート
- Internet Explorer 11はサポート対象外

### パフォーマンス考慮事項
- クライアントサイドのみの処理: すべての処理はブラウザ内で行われ、サーバーは静的ファイル配信のみ
- 大量のトリガーや状態を含むJSONファイルの処理時にパフォーマンスが低下する可能性

### セキュリティ考慮事項
- ファイルはローカルで処理され、サーバーにアップロードされない
- ユーザーデータはローカルストレージに保存されない（セッション間で状態は保持されない）

### 拡張性
- 新しいトリガータイプや属性を追加する場合は、以下のファイルの更新が必要：
  - `src/types/Trigger.ts`: 型定義
  - `src/encoder/json.ts`: エンコーディング/デコーディングロジック
  - 関連するUIコンポーネント
