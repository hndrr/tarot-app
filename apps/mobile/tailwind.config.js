const sharedConfig = require("../../packages/ui/tailwind.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [], // content は必須だが、スキャンは preset に任せるので空配列
  presets: [require("nativewind/preset"), sharedConfig], // NativeWind と共通設定をプリセットとして適用
  theme: {
    // extend は空なので削除
    // mobile 固有のテーマ拡張があれば extend: {} の中に追加
    animation: {
      // mobile 固有の可能性
      fade: "fade 2.5s infinite",
      spin: "spin 1s linear infinite",
    },
    keyframes: {
      // mobile 固有の可能性
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
    // mobile 固有のプラグインがあればここに追加
  ],
};
