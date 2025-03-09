import type { Card } from "@/types";

// APIエンドポイントのベースURL
const baseUrl = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";

// セッション系API
export const sessionAPI = {
  // カード情報とhasVisitedフラグを保存
  saveSession: async (data: { card?: Card; hasVisited?: boolean }) => {
    return fetch(`${baseUrl}/api/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // セッション情報を取得
  getSession: async () => {
    return fetch(`${baseUrl}/api/session`);
  },
};

// タロットカード解釈API
export const tarotAPI = {
  // タロットカードの解釈を取得
  getInterpretation: async (data: { name: string; meaning: string }) => {
    return fetch(`${baseUrl}/api/tarot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};
