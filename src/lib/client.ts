import { hc } from "hono/client";
import type { SessionApiType, TarotApiType } from "@/app/api/api-schemas";

// サーバーサイドでのベースURL
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return ""; // クライアントサイドでは相対パスを使用
  }
  // サーバーサイドでは完全なURLを構築
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000"; // ローカル環境ではHTTPを使用
};

const baseUrl = getBaseUrl();
console.log("=== API Configuration ===");
console.log("API Base URL:", baseUrl);
console.log("Full Tarot API URL:", `${baseUrl}/api/tarot`);

// Honoクライアントの作成（クレデンシャルを含める設定を追加）
export const sessionAPI = hc<SessionApiType>(`${baseUrl}/api`, {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
      },
    });
    return response;
  },
});

export const tarotAPI = hc<TarotApiType>(`${baseUrl}/api`, {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    console.log("=== Tarot API Request Started ===");
    console.log("Request URL:", input.toString());
    console.log("Request Method:", init?.method);
    console.log("Request Headers:", JSON.stringify(init?.headers, null, 2));
    console.log(
      "Request Body:",
      init?.body ? JSON.parse(init.body as string) : null
    );

    const response = await fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
      },
    });
    console.log("=== Tarot API Response Received ===");
    console.log("Response Status:", response.status);
    console.log(
      "Response Headers:",
      Object.fromEntries(response.headers.entries())
    );
    return response;
  },
});
