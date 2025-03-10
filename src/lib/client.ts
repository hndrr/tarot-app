import { hc } from "hono/client";
import type { AppType } from "@/app/api";

const getBaseUrl = () => {
  const apiHost = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  return apiHost;
};

export const client = hc<AppType>(getBaseUrl());
