import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getCookie, setCookie } from "hono/cookie";
import { CardSchema } from "../api-schema";

// セッションリクエストスキーマ
const SessionRequestSchema = z.object({
  card: CardSchema.optional(),
  hasVisited: z.boolean().optional(),
});

// セッションAPI
export const sessionApi = new Hono()
  // セッションデータを取得するGETエンドポイント
  .get("/", async (c) => {
    try {
      const sessionStr = getCookie(c, "tarot-cards");

      if (!sessionStr) {
        return c.json({ card: null, hasVisited: false });
      }

      try {
        const data = JSON.parse(sessionStr);
        return c.json({
          card: data.card || null,
          hasVisited: Boolean(data.hasVisited),
        });
      } catch (error) {
        console.error("Error parsing session data:", error);
        return c.json({ card: null, hasVisited: false });
      }
    } catch (error) {
      console.error("Error reading session:", error);
      return c.json(
        { error: "セッションの読み込みに失敗しました" },
        { status: 500 }
      );
    }
  })
  // セッションデータを保存するPOSTエンドポイント
  .post("/", zValidator("json", SessionRequestSchema), async (c) => {
    try {
      const data = await c.req.valid("json");

      // 現在のセッションデータを取得
      const existingData = getCookie(c, "tarot-cards");
      let sessionData = { card: null, hasVisited: false };

      if (existingData) {
        try {
          sessionData = JSON.parse(existingData);
        } catch (error) {
          console.error("Failed to parse existing session data:", error);
        }
      }

      // カードの更新
      if (data.card) {
        sessionData.card = data.card;
      }

      // hasVisitedフラグの更新
      if (data.hasVisited !== undefined) {
        sessionData.hasVisited = data.hasVisited;
      }

      // セッションの保存
      setCookie(c, "tarot-cards", JSON.stringify(sessionData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1週間
      });

      return c.json({ success: true });
    } catch (error) {
      console.error("Error saving session data:", error);
      return c.json(
        { error: "セッションの保存に失敗しました" },
        { status: 500 }
      );
    }
  });
