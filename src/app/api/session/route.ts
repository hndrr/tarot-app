import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { SessionRequestSchema, SessionDataSchema } from "../api-schemas";

const app = new Hono();

app.post(
  "/api/session",
  zValidator("json", SessionRequestSchema),
  async (c) => {
    try {
      const data = c.req.valid("json");
      console.log("Session API received data:", JSON.stringify(data));

      const existingData = getCookie(c, "tarot-cards");
      console.log("Existing cookie data:", existingData);

      const sessionData = SessionDataSchema.parse(
        existingData
          ? JSON.parse(existingData)
          : { cards: [], hasVisited: false }
      );
      console.log("Parsed session data:", JSON.stringify(sessionData));

      if (data.card) {
        console.log("Processing card data:", JSON.stringify(data.card));
        const existingIndex = sessionData.cards.findIndex(
          (c) => c.id === data.card!.id
        );
        console.log("Existing card index:", existingIndex);

        if (existingIndex >= 0) {
          console.log("Updating existing card");
          sessionData.cards[existingIndex] = data.card;
        } else {
          console.log("Adding new card");
          sessionData.cards.push(data.card);
        }
      }

      if (data.tarotMessage) {
        const { cardId, message } = data.tarotMessage;
        const cardIndex = sessionData.cards.findIndex((c) => c.id === cardId);
        if (cardIndex >= 0) {
          sessionData.cards[cardIndex].tarotMessage = message;
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
  }
);

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
