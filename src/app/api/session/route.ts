import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getCookie, setCookie } from "hono/cookie";

const app = new Hono();

interface Card {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
}

interface SessionData {
  cards: Card[];
  hasVisited: boolean;
}

app.post("/api/session", async (c) => {
  try {
    const data = (await c.req.json()) as {
      card?: Card;
      hasVisited?: boolean;
    };

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
        (c) => c.id === data.card!.id
      );
      if (existingIndex >= 0) {
        sessionData.cards[existingIndex] = data.card;
      } else {
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
    return c.json({ error: "セッションの保存に失敗しました" }, 500);
  }
});

app.get("/", async (c) => {
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
    return c.json({ error: "セッションの読み込みに失敗しました" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
