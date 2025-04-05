import { Context, Next } from "hono";

// 簡易的なインメモリストレージ（本番環境ではRedisなどを使用することを推奨）
const requestCounts: Record<string, { count: number; resetTime: number }> = {};

// レート制限の設定
const RATE_LIMIT = 100; // 1時間あたりのリクエスト数
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1時間（ミリ秒）

/**
 * 簡易的なIPベースのレート制限ミドルウェア
 */
export const rateLimiter = async (c: Context, next: Next) => {
  // クライアントのIPアドレスを取得 (Vercel環境などを考慮)
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0].trim() ||
    c.req.header("x-real-ip") ||
    "unknown";
  const now = Date.now();

  // IPアドレスごとのリクエスト数を管理
  if (!requestCounts[ip] || requestCounts[ip].resetTime < now) {
    // 新しいウィンドウを開始
    requestCounts[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
    console.log(`Rate limit window started for IP: ${ip}`);
  } else {
    // 既存のウィンドウ内でカウントを増加
    requestCounts[ip].count += 1;
    console.log(
      `Request count for IP ${ip}: ${requestCounts[ip].count}/${RATE_LIMIT}`
    );
  }

  // レート制限を超えた場合
  if (requestCounts[ip].count > RATE_LIMIT) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    // レート制限情報をヘッダーに追加
    c.header("X-RateLimit-Limit", RATE_LIMIT.toString());
    c.header("X-RateLimit-Remaining", "0");
    c.header("X-RateLimit-Reset", requestCounts[ip].resetTime.toString());
    c.status(429); // Too Many Requests
    return c.json({ error: "Too many requests, please try again later." });
  }

  // レート制限情報をヘッダーに追加
  c.header("X-RateLimit-Limit", RATE_LIMIT.toString());
  c.header(
    "X-RateLimit-Remaining",
    Math.max(0, RATE_LIMIT - requestCounts[ip].count).toString()
  );
  c.header("X-RateLimit-Reset", requestCounts[ip].resetTime.toString());

  await next();
};
