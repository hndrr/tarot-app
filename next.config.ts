import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
    GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  },
};

export default nextConfig;
