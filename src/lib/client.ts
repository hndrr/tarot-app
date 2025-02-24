"use client";
import { z } from "zod";
import { createSessionSchema, drawCardSchema } from "./schema";

// APIクライアントの型定義
export const client = {
  session: {
    create: async (data: z.infer<typeof createSessionSchema>) => {
      const res = await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },

    drawCard: async (data: z.infer<typeof drawCardSchema>) => {
      const res = await fetch("/api/session/card/draw", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
  },
};
