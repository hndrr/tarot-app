"use server";

import { cookies } from "next/headers";

export interface Card {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
}

export type SessionData = {
  card: Card | null;
  hasVisited: boolean;
};

// Cookieをクリアする関数
export async function clearTarotCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("tarot-cards");
}

export async function saveCardToSession(card: Card) {
  try {
    const cookieStore = await cookies();

    // 単一のカードとして保存
    const sessionData: SessionData = {
      card: card,
      hasVisited: true,
    };

    await cookieStore.set("tarot-cards", JSON.stringify(sessionData), {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1週間
    });
  } catch (error) {
    console.error("Failed to save card to session:", error);
    throw new Error("カードの保存に失敗しました");
  }
}

export async function getSessionCards(): Promise<Card[]> {
  try {
    const cookieStore = await cookies();
    const sessionStr = cookieStore.get("tarot-cards")?.value;

    if (!sessionStr) {
      return [];
    }

    try {
      const data = JSON.parse(sessionStr) as SessionData;
      return data.card ? [data.card] : [];
    } catch (error) {
      console.error("Failed to parse session data:", error);
      return [];
    }
  } catch (error) {
    console.error("Failed to get cards from session:", error);
    return [];
  }
}
