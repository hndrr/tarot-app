import type { Config } from "tailwindcss";

// この設定は apps/web と apps/mobile から preset として読み込まれる想定
const config: Config = {
  content: [
    // アプリケーションのファイルパス (apps/*)
    "../../apps/web/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/mobile/src/**/*.{js,ts,jsx,tsx}",
    // このパッケージ (packages/ui) 内のファイルパス
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ここに共通のテーマ拡張を定義
      colors: {
        primary: "#FF6347", // 例: トマト色
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    // ここに共通のプラグインを追加 (例: typography)
  ],
};
export default config;
