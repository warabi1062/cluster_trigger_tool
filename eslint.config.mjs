import prettierRecommended from "eslint-plugin-prettier/recommended";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";

export default tseslint.config(
  {
    ignores: [
      "**/babel.config.js",
      "**/eslint.config.mjs",
      "**/prettier.config.js",
      "**/next.config.mjs",
      "**/tailwind.config.js",
      "**/tsconfig.json",
      "**/postcss.config.mjs",
      "**/next-env.d.ts",
      "**/build/",
      "**/bin/",
      "**/obj/",
      "**/out/",
      "**/.next/",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  prettierRecommended,
  {
    name: "next/core-web-vitals",
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
);
