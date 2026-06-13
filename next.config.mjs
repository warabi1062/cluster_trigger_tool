/** @type {import('next').NextConfig} */

// GitHub Pages のプロジェクトページ（https://<user>.github.io/cluster_trigger_tool/）
// で配信するため、ビルド時のみ basePath / assetPrefix を付与する。
// ローカル開発（pnpm dev）では付与せず、ルート配信のままにする。
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "cluster_trigger_tool";
const basePath = isGithubPages ? `/${repositoryName}` : "";

const nextConfig = {
  reactStrictMode: true,
  // 静的HTMLとして書き出す（out ディレクトリ）。GitHub Pages 等の静的ホスティング向け。
  output: "export",
  // 各ルートを <route>/index.html として書き出し、末尾スラッシュで配信する。
  trailingSlash: true,
  // 静的書き出しでは next/image の最適化サーバーが使えないため無効化する。
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
  // 手書きの絶対パス（favicon 等）に basePath を付与するためコード側へ公開する。
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
