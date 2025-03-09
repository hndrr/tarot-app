import { hc } from "hono/client";
import type { SessionApiType, TarotApiType } from "@/app/api/api-schemas";

// APIエンドポイントのベースURL
const baseUrl = process.env.NEXT_PUBLIC_API_HOST || "";
console.log("=== API Configuration ===");
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
    console.log("=== Tarot API Request Started ===");
    console.log("Request URL:", input.toString());
    console.log("Request Method:", init?.method);
    console.log("Request Headers:", JSON.stringify(init?.headers, null, 2));
    console.log(
      "Request Body:",
      init?.body ? JSON.parse(init.body as string) : null
    );

    return fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      const clonedResponse = response.clone();
      try {
        const data = await clonedResponse.json();
        console.log("Response Body:", JSON.stringify(data, null, 2));
      } catch {
        console.log("Response is not JSON");
        const text = await clonedResponse.text();
        console.log("Response Text:", text);
      }
      return response;
    });
  },
});
