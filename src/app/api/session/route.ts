import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

const CardSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.string(),
  isReversed: z.boolean(),
});

const RequestSchema = z.object({
  card: CardSchema.optional(),
  hasVisited: z.boolean().optional(),
});

const SessionDataSchema = z.object({
  cards: z.array(CardSchema),
  hasVisited: z.boolean(),
});

app.post("/api/session", zValidator("json", RequestSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const existingData = getCookie(c, "tarot-cards");
    const sessionData = SessionDataSchema.parse(
      existingData ? JSON.parse(existingData) : { cards: [], hasVisited: false }
    );

    if (data.card) {
      const existingIndex = sessionData.cards.findIndex(
        (c) => c.id === data.card!.id
      );
      if (existingIndex >= 0) {
        sessionData.cards[existingIndex] = data.card;
      } else {
        sessionData.cards.push(data.card);
      }
    }

    if (data.hasVisited !== undefined) {
      sessionData.hasVisited = data.hasVisited;
    }

    setCookie(c, "tarot-cards", JSON.stringify(sessionData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving session data:", error);
    return c.json({ error: "セッションの保存に失敗しました" }, 500);
  }
});

app.get("/api/session", async (c) => {
  try {
    const sessionStr = getCookie(c, "tarot-cards");
    if (!sessionStr) {
      return c.json({ cards: [], hasVisited: false });
    }

    const sessionData = SessionDataSchema.parse(JSON.parse(sessionStr));
    return c.json(sessionData);
  } catch (error) {
    console.error("Error reading session:", error);
    return c.json({ error: "セッションの読み込みに失敗しました" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
