import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// カードのスキーマ定義
const CardSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.string(),
  isReversed: z.boolean(),
});

// セッションリクエストスキーマ
const SessionRequestSchema = z.object({
  card: CardSchema.optional(),
  hasVisited: z.boolean().optional(),
});

// セッションデータスキーマ
export const SessionDataSchema = z.object({
  cards: z.array(CardSchema),
  hasVisited: z.boolean(),
});

// タロットリクエストスキーマ
const TarotRequestSchema = z.object({
  name: z.string(),
  meaning: z.string(),
});

// タロットレスポンススキーマ
export const TarotResponseSchema = z.object({
  upright: z.string(),
  reversed: z.string(),
});

// APIの基本パス
const apiBase = "/api";

// セッションAPI用のHonoインスタンス定義
export const sessionApiDef = new Hono()
  .post(
    `${apiBase}/session`,
    zValidator("json", SessionRequestSchema),
    async (c) => {
      return c.json({ success: true });
    }
  )
  .get(`${apiBase}/session`, async (c) => {
    return c.json({
      cards: [],
      hasVisited: false,
    });
  });

// タロットAPI用のHonoインスタンス定義
export const tarotApiDef = new Hono().post(
  `${apiBase}/tarot`,
  zValidator("json", TarotRequestSchema),
  async (c) => {
    return c.json({
      upright: "",
      reversed: "",
    });
  }
);

// API型定義をエクスポート
export type SessionApiType = typeof sessionApiDef;
export type TarotApiType = typeof tarotApiDef;
