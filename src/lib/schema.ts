import { z } from "zod";

export const createSessionSchema = z.object({
  userId: z.string(),
  readingType: z.enum(["daily", "weekly", "monthly"]),
});

export const drawCardSchema = z.object({
  sessionId: z.string(),
  position: z.number().optional(),
});

export const saveCardSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.string(),
  isReversed: z.boolean(),
  message: z.string().optional(),
});
