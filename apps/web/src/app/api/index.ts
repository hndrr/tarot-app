import { Hono } from "hono";
import { sessionApi } from "./session/api";
import { tarotApi } from "./tarot/api";
import { apiKeyAuth } from "./middleware/apiKeyAuth"; // APIキー認証ミドルウェアをインポート
import { rateLimiter } from "./middleware/rateLimiter"; // レート制限ミドルウェアをインポート

// メインのAPIルーター
const api = new Hono()
  // すべてのAPIルートにレート制限を適用
  .use("*", rateLimiter)
  .route("/api/session", sessionApi)
  // /api/tarot ルートに apiKeyAuth ミドルウェアを適用
  .use("/api/tarot/*", apiKeyAuth)
  .route("/api/tarot", tarotApi);

export type AppType = typeof api;
export default api;
