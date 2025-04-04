import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals"; // globals をインポート
import tseslint from "typescript-eslint"; // typescript-eslint をインポート
import reactPlugin from "eslint-plugin-react"; // React プラグインをインポート
import hooksPlugin from "eslint-plugin-react-hooks"; // React Hooks プラグインをインポート
// import reactNativePlugin from "eslint-plugin-react-native"; // 必要に応じて React Native プラグインをインポート

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  // グローバル設定 (全ファイルに適用)
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.expo/**",
      "**/ios/**", // Expo/RN プロジェクトのネイティブコードを除外
      "**/android/**", // Expo/RN プロジェクトのネイティブコードを除外
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
    languageOptions: {
      globals: {
        ...globals.browser, // ブラウザ環境用グローバル変数
        ...globals.node, // Node.js 環境用グローバル変数
        ...globals.es2021, // ES2021 グローバル変数
      },
    },
  },

  // TypeScript 設定 (ts, tsx ファイルに適用)
  ...tseslint.configs.recommended, // typescript-eslint の推奨設定
  {
    // ルールを明示的に設定
    files: ["**/*.{ts,tsx}"], // TS/TSX ファイルに適用
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
    },
  },

  // React 設定 (tsx ファイルに適用)
  {
    files: ["**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // React 17+ では不要
    },
    settings: {
      react: {
        version: "detect", // React のバージョンを自動検出
      },
    },
  },

  // Next.js アプリ用設定 (apps/web 配下)
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    ...compat
      .extends("next/core-web-vitals", "next/typescript")
      .reduce((acc, config) => ({ ...acc, ...config }), {}), // FlatCompat の結果を展開してマージ
  },

  // Expo/React Native アプリ用設定 (apps/mobile 配下)
  {
    files: ["apps/mobile/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        // ...globals.reactNative, // 必要に応じて React Native グローバルを追加
      },
    },
    // plugins: { // 必要に応じて RN プラグインを追加
    //   'react-native': reactNativePlugin,
    // },
    // rules: { // 必要に応じて RN ルールを追加
    //   ...reactNativePlugin.configs.all.rules,
    // },
  },

  // 共有パッケージ用設定 (packages 配下) - 基本的な TS 設定を適用
  {
    files: ["packages/**/*.{ts,tsx}"],
    // 必要に応じてパッケージ固有のルールを追加
  }, // <- カンマを追加

  // React Native (.native.tsx) ファイル用設定
  {
    files: ["**/*.native.tsx"],
    rules: {
      "@typescript-eslint/no-require-imports": "off", // require() を許可
    },
  },
]; // <- 正しい閉じ括弧

export default eslintConfig;
