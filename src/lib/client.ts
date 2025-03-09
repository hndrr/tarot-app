import { hc } from "hono/client";
import type { SessionApiType, TarotApiType } from "@/app/api/api-schemas";

// APIエンドポイントのベースURL
const baseUrl = process.env.NEXT_PUBLIC_API_HOST || "";
console.log("API Base URL:", baseUrl);
console.log("Full Tarot API URL:", `${baseUrl}/api/tarot`);

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
    console.log("Tarot API Request URL:", input.toString());
    console.log("Tarot API Request Method:", init?.method);
    console.log("Tarot API Request Headers:", init?.headers);
    console.log("Tarot API Request Body:", init?.body);

    return fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      console.log("Tarot API Response Status:", response.status);
      const clonedResponse = response.clone();
      try {
        const data = await clonedResponse.json();
        console.log("Tarot API Response Data:", JSON.stringify(data));
      } catch {
        console.log("Tarot API Response is not JSON");
      }
      return response;
    });
  },
});
