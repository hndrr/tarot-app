import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { handle } from "hono/vercel";
import api from "./app/api";

// APIリクエストをHonoで処理するミドルウェア
export async function middleware(request: NextRequest) {
  // APIパスのみを処理
  if (request.nextUrl.pathname.startsWith("/api")) {
    return handle(api)(request);
  }

  // その他のリクエストはそのまま通す
  return NextResponse.next();
}

// マッチするパスを指定
export const config = {
  matcher: "/api/:path*",
};
