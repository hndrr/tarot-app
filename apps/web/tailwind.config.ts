import type { Config } from "tailwindcss";
import sharedConfig from "../../packages/ui/tailwind.config"; // 共通設定をインポート

const config: Config = {
  content: [], // content は必須だが、スキャンは preset に任せるので空配列
  presets: [sharedConfig], // 共通設定をプリセットとして適用
  theme: {
    extend: {
      // web 固有のテーマ拡張があればここに追加
      // sharedConfig の theme.extend を上書き・拡張する
      colors: {
        background: "var(--background)", // web 固有の可能性
        foreground: "var(--foreground)", // web 固有の可能性
      },
    },
    // sharedConfig の theme を上書きしたい場合は extend の外に書く
    animation: {
      // web 固有の可能性
      fade: "fade 2.5s infinite",
      spin: "spin 1s linear infinite",
    },
    keyframes: {
      // web 固有の可能性
      fade: {
        "0%": { opacity: "0" },
        "50%": { opacity: "1" },
        "100%": { opacity: "0" },
      },
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
  },
  plugins: [
    // web 固有のプラグインがあればここに追加
  ],
};
export default config;
