import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Card } from "@/lib/actions";

interface SessionData {
  cards: Card[];
  hasVisited: boolean;
}

// セッションデータを保存するPOSTエンドポイント
export async function POST(request: Request) {
  try {
    const data = (await request.json()) as {
      card?: Card;
      hasVisited?: boolean;
    };

    // 現在のセッションデータを取得
    const cookieStore = await cookies();
    const existingData = cookieStore.get("tarot-cards")?.value;
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
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "tarot-cards",
      value: JSON.stringify(sessionData),
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1週間
    });

    return response;
  } catch (error) {
    console.error("Error saving session data:", error);
    return NextResponse.json(
      { error: "セッションの保存に失敗しました" },
      { status: 500 }
    );
  }
}

// セッションデータを取得するGETエンドポイント
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionStr = cookieStore.get("tarot-cards")?.value;

    if (!sessionStr) {
      return NextResponse.json({ cards: [], hasVisited: false });
    }

    try {
      const data = JSON.parse(sessionStr);
      return NextResponse.json({
        cards: Array.isArray(data.cards) ? data.cards : [],
        hasVisited: Boolean(data.hasVisited),
      });
    } catch (error) {
      console.error("Error parsing session data:", error);
      return NextResponse.json({ cards: [], hasVisited: false });
    }
  } catch (error) {
    console.error("Error reading session:", error);
    return NextResponse.json(
      { error: "セッションの読み込みに失敗しました" },
      { status: 500 }
    );
  }
}
