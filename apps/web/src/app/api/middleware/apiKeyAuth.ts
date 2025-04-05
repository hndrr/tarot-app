import { Context, Next } from "hono";

// 許可するAPIキーのリスト（環境変数から取得、カンマ区切り）
// 例: ALLOWED_API_KEYS=key1,key2,key3
const validApiKeys = process.env.ALLOWED_API_KEYS
  ? process.env.ALLOWED_API_KEYS.split(",")
      .map((key) => key.trim())
      .filter(Boolean)
  : [];

/**
 * APIキー認証ミドルウェア
 * リクエストヘッダーの 'x-api-key' を検証します。
 */
export const apiKeyAuth = async (c: Context, next: Next) => {
  // APIキーをヘッダーから取得
  const apiKey = c.req.header("x-api-key");

  // 開発環境では認証をスキップ（オプション）
  // if (process.env.NODE_ENV === "development") {
  //   console.log("Skipping API key auth in development mode.");
  //   await next();
  //   return;
  // }

  // APIキーが提供されていない場合
  if (!apiKey) {
    console.warn("API key is missing.");
    return c.json({ error: "API key is required" }, { status: 401 });
  }

  // APIキーが無効な場合
  if (!validApiKeys.includes(apiKey)) {
    console.warn(`Invalid API key received: ${apiKey}`);
    return c.json({ error: "Invalid API key" }, { status: 403 });
  }

  // 認証成功
  console.log("API key authentication successful.");
  await next();
};
