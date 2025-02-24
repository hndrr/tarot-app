"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createSessionSchema, drawCardSchema, saveCardSchema } from "./schema";

export interface Card {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
  message?: string;
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

// カード操作の関数
export async function drawCard(data: z.infer<typeof drawCardSchema>) {
  const { position } = data;
  return {
    id: Math.random(),
    name: "Test Card",
    position: position ? `position-${position}` : "upright",
    isReversed: Math.random() > 0.5,
  };
}

// セッション管理の関数
export async function createSession(data: z.infer<typeof createSessionSchema>) {
  const { userId } = data;
  return {
    id: Math.random().toString(),
    userId,
    createdAt: new Date(),
  };
}

// 既存のsaveCardToSession関数を活用
export async function saveCard(data: z.infer<typeof saveCardSchema>) {
  await saveCardToSession(data);
  return { ...data, saved: true };
}

export async function getSession(id: string) {
  try {
    const cookieStore = await cookies();
    const sessionStr = cookieStore.get("tarot-session")?.value;

    if (!sessionStr) {
      throw new Error("セッションが見つかりません");
    }

    const sessionData = JSON.parse(sessionStr);

    if (sessionData.id !== id) {
      throw new Error("セッションIDが一致しません");
    }

    return {
      id: sessionData.id,
      userId: sessionData.userId,
      createdAt: new Date(sessionData.createdAt),
      cards: await getSessionCards(),
    };
  } catch (error) {
    console.error("Failed to get session:", error);
    throw new Error("セッションの取得に失敗しました");
  }
}
