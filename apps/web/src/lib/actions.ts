"use server";

import { cookies } from "next/headers";

export interface Card {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
}

export async function saveCardToSession(card: Card) {
  try {
    const cookieStore = await cookies();
    const existingCookie = cookieStore.get("tarot-cards")?.value;
    let sessionData;

    try {
      sessionData = existingCookie ? JSON.parse(existingCookie) : { cards: [] };
      if (!sessionData.cards) {
        sessionData.cards = [];
      }
    } catch (error) {
      console.error("Failed to parse existing cookie:", error);
      sessionData = { cards: [] };
    }

    // 既存のカードがあれば更新、なければ追加
    const existingCardIndex = sessionData.cards.findIndex(
      (c: Card) => c.id === card.id
    );
    if (existingCardIndex >= 0) {
      sessionData.cards[existingCardIndex] = card;
    } else {
      sessionData.cards.push(card);
    }

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
      const data = JSON.parse(sessionStr);

      // データ構造の確認と変換
      if (Array.isArray(data)) {
        // 古い形式: 配列直接保存
        return data;
      } else if (data.cards && Array.isArray(data.cards)) {
        // 新しい形式: { cards: Card[] }
        return data.cards;
      } else {
        console.error("Invalid session data structure");
        return [];
      }
    } catch (error) {
      console.error("Failed to parse session data:", error);
      return [];
    }
  } catch (error) {
    console.error("Failed to get cards from session:", error);
    return [];
  }
}
