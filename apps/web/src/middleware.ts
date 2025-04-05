import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { handle } from "hono/vercel";
import api from "./app/api";

// 許可するオリジンのリスト
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        // 本番環境
        "capacitor://localhost", // Capacitor iOS/Android
        "ionic://localhost", // Ionic iOS/Android
        // 必要に応じて本番Webアプリのオリジンを追加
        // 'https://your-production-app.com'
      ]
    : [
        // 開発環境
        "http://localhost:8081", // Expo Go Web
        "http://localhost:19006", // Expo Web
        // 必要に応じてExpo GoのネイティブIPを追加 (例: 'exp://192.168.1.100:19000')
      ];

// APIリクエストをHonoで処理し、CORSヘッダーを追加するミドルウェア
export async function middleware(request: NextRequest) {
  // APIパスのみを処理
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Honoアプリケーションにリクエストを処理させる
    const response = await handle(api)(request);

    // CORSヘッダーを設定
    const origin = request.headers.get("origin");
    if (origin && allowedOrigins.includes(origin)) {
      // 変数名を allowedOrigins に統一
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, x-api-key"
      ); // x-api-keyを追加
      response.headers.set("Access-Control-Allow-Credentials", "true");
    } else if (origin) {
      console.warn(`CORS: Request from origin ${origin} blocked.`);
    }

    // OPTIONSリクエストへの対応 (Preflight)
    if (request.method === "OPTIONS") {
      const headers = new Headers(response.headers);
      if (origin && allowedOrigins.includes(origin)) {
        // 変数名を allowedOrigins に統一
        headers.set("Access-Control-Allow-Origin", origin);
      }
      headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, x-api-key"
      ); // x-api-keyを追加
      headers.set("Access-Control-Allow-Credentials", "true");
      return new NextResponse(null, { status: 204, headers });
    }

    return response;
  }

  // その他のリクエストはそのまま通す
  return NextResponse.next();
}

// マッチするパスを指定
export const config = {
  matcher: "/api/:path*",
};
