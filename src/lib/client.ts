import { hc } from "hono/client";
import type { SessionApiType, TarotApiType } from "@/app/api/api-schemas";

// APIエンドポイントのベースURL
const baseUrl = process.env.NEXT_PUBLIC_API_HOST || "";

// Honoクライアントの作成（クレデンシャルを含める設定を追加）
export const sessionAPI = hc<SessionApiType>(`${baseUrl}/api`, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
      },
    });
  },
});

export const tarotAPI = hc<TarotApiType>(`${baseUrl}/api`, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    console.log("API Request URL:", input);
    console.log("API Request Init:", JSON.stringify(init));

    return fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      console.log("API Response Status:", response.status);
      const clonedResponse = response.clone();
      try {
        const data = await clonedResponse.json();
        console.log("API Response Data:", JSON.stringify(data));
      } catch {
        console.log("API Response is not JSON");
      }
      return response;
    });
  },
});
