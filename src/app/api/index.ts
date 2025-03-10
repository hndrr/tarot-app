import { Hono } from "hono";
import { sessionApi } from "./session/api";
import { tarotApi } from "./tarot/api";

// メインのAPIルーター
const api = new Hono()
  .route("/api/session", sessionApi)
  .route("/api/tarot", tarotApi);

export type AppType = typeof api;
export default api;
