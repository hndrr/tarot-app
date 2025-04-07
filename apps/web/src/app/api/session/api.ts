import { Hono } from "hono";
import { cors } from "hono/cors"; // CORSミドルウェアをインポート
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getCookie, setCookie } from "hono/cookie";
import { CardSchema, SessionData } from "@tarrot/api-schema";

// セッションリクエストスキーマ
const SessionRequestSchema = z.object({
  card: CardSchema.optional(),
  hasVisited: z.boolean().optional(),
});
export const sessionApi = new Hono()
  // セッションデータを取得するGETエンドポイント
  .get("/", async (c) => {
    try {
      const sessionStr = getCookie(c, "tarot-cards");

      if (!sessionStr) {
        return c.json({ cards: [], hasVisited: false });
      }

      try {
        const data = JSON.parse(sessionStr);
        return c.json({
          cards: Array.isArray(data.cards) ? data.cards : [],
          hasVisited: Boolean(data.hasVisited),
        });
      } catch (error) {
        console.error("Error parsing session data:", error);
        return c.json({ cards: [], hasVisited: false });
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
      let sessionData: SessionData = { cards: [], hasVisited: false };

      if (existingData) {
        try {
          const parsed = JSON.parse(existingData);
          sessionData = {
            cards: Array.isArray(parsed.cards) ? parsed.cards : [],
            hasVisited: Boolean(parsed.hasVisited),
          };
        } catch (error) {
          console.error("Failed to parse existing session data:", error);
        }
      }

      // カードの更新または追加
      if (data.card) {
        const existingIndex = sessionData.cards.findIndex(
          (card) => card.id === data.card!.id
        );
        if (existingIndex >= 0) {
          // 既存のカードを更新
          sessionData.cards[existingIndex] = data.card;
        } else {
          // 新しいカードを追加
          sessionData.cards.push(data.card);
        }
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
