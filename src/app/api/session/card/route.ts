import { Hono } from "hono";
import { handle } from "hono/vercel";
import { zValidator } from "@hono/zod-validator";
import { drawCard, saveCard } from "@/lib/actions";
import { drawCardSchema, saveCardSchema } from "@/lib/schema";

const api = new Hono().basePath("/api/session/card");

// カードドローのエンドポイント
api.post("/draw", zValidator("json", drawCardSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    const card = await drawCard(data);
    return c.json(card, 201);
  } catch (error) {
    console.error("Draw card error:", error);
    return c.json({ error: "Failed to draw card" }, 500);
  }
});

// カード保存のエンドポイント
api.post("/save", zValidator("json", saveCardSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    const savedCard = await saveCard(data);
    return c.json(savedCard, 201);
  } catch (error) {
    console.error("Save card error:", error);
    return c.json({ error: "Failed to save card" }, 500);
  }
});

export const POST = handle(api);
