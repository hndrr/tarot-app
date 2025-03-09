import { hc } from "hono/client";
import type { SessionApiType, TarotApiType } from "@/app/api/api-schemas";

// APIエンドポイントのベースURL
const baseUrl = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";

// Honoクライアントの作成
export const sessionAPI = hc<SessionApiType>(baseUrl);
export const tarotAPI = hc<TarotApiType>(baseUrl);
