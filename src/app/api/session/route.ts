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
      console.log(
        "Session API received card:",
        data.card ? JSON.stringify(data.card) : "null"
      );

      const existingData = getCookie(c, "tarot-cards");
      console.log("Existing cookie data:", existingData);

      const sessionData = SessionDataSchema.parse(
        existingData
          ? JSON.parse(existingData)
          : { card: null, hasVisited: false }
      );
      console.log("Parsed session data:", JSON.stringify(sessionData));

      if (data.card) {
        console.log("Processing card data:", JSON.stringify(data.card));
        console.log("Card ID:", data.card.id);
        console.log("Card isReversed:", data.card.isReversed);
        console.log("typeof isReversed:", typeof data.card.isReversed);

        sessionData.card = {
          id: data.card.id,
          name: data.card.name,
          position: data.card.position,
          isReversed: Boolean(data.card.isReversed),
          ...(data.card.tarotMessage && {
            tarotMessage: data.card.tarotMessage,
          }),
        };
        console.log("Updated card:", JSON.stringify(sessionData.card));
      } else {
        console.log("No card data in request, keeping existing or null");
      }

      if (data.tarotMessage) {
        const { cardId, message } = data.tarotMessage;
        if (sessionData.card && sessionData.card.id === cardId) {
          sessionData.card.tarotMessage = message;
          console.log("Updated tarot message for card:", cardId);
        } else {
          console.log("No matching card found for tarot message:", cardId);
        }
      }

      if (data.hasVisited !== undefined) {
        sessionData.hasVisited = data.hasVisited;
      }

      console.log("Saving session data:", JSON.stringify(sessionData));

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
      return c.json({ card: null, hasVisited: false });
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
