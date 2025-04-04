import { z } from "zod";

// タロットレスポンススキーマ
export const TarotResponseSchema = z.object({
  upright: z.string(),
  reversed: z.string(),
});

// カードのスキーマ定義
export const CardSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.string(),
  isReversed: z.boolean(),
  tarotMessage: TarotResponseSchema.optional(),
});

// セッションリクエストスキーマ
export const SessionRequestSchema = z.object({
  card: CardSchema.optional().nullable(),
  hasVisited: z.boolean().optional(),
  tarotMessage: z
    .object({
      cardId: z.number(),
      message: TarotResponseSchema,
    })
    .optional(),
});

// セッションデータスキーマ
export const SessionDataSchema = z.object({
  cards: z.array(CardSchema),
  hasVisited: z.boolean(),
});

// タロットリクエストスキーマ
export const TarotRequestSchema = z.object({
  name: z.string(),
  meaning: z.string(),
});

// APIのレスポンス型
export type TarotResponse = z.infer<typeof TarotResponseSchema>;
export type Card = z.infer<typeof CardSchema>;
export type SessionRequest = z.infer<typeof SessionRequestSchema>;
export type SessionData = z.infer<typeof SessionDataSchema>;
export type TarotRequest = z.infer<typeof TarotRequestSchema>;
