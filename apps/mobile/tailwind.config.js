import sharedConfig from "../../packages/ui/tailwind.config.ts"; // Use import and .ts extension

import nativewindPreset from "nativewind/preset"; // Import preset

/** @type {import('tailwindcss').Config} */
export default {
  // Use export default
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan mobile app source files
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [nativewindPreset, sharedConfig], // Use imported preset
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
