import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@repo/constants", "@repo/types"], // トランスパイル対象のパッケージを追加
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
  env: {
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID!,
    CLOUDFLARE_GATEWAY_NAME: process.env.CLOUDFLARE_GATEWAY_NAME!,
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN!,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  },
};

export default nextConfig;
