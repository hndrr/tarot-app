"use server";

import { Card } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sessionAPI } from "@/lib/client";

// 以下の関数はサーバー側でのみ実行され、クライアント側ではsessionAPIを使用

export async function saveCardToSession(
  card: Card,
  hasVisited: boolean = true
) {
  try {
    console.log("Server action: card received:", JSON.stringify(card));
    console.log("Server action: hasVisited:", hasVisited);

    // カードデータを準備（isReversedを確実に真偽値に変換）
    const cardToSave: Card = {
      id: card.id,
      name: card.name,
      position: Boolean(card.isReversed) ? "reversed" : "upright",
      isReversed: Boolean(card.isReversed),
      ...(card.tarotMessage && { tarotMessage: card.tarotMessage }),
    };

    console.log(
      "Server action: prepared card data:",
      JSON.stringify(cardToSave)
    );

    // セッションデータを準備
    const sessionData = {
      card: cardToSave,
      hasVisited: hasVisited,
    };

    console.log(
      "Server action: saving session data:",
      JSON.stringify(sessionData)
    );

    // 直接cookieに保存
    try {
      const cookiesStore = await cookies();
      cookiesStore.set("tarot-cards", JSON.stringify(sessionData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7日間
      });
      console.log("Server action: Cookie set successfully");
    } catch (cookieError) {
      console.error("Server action: Failed to set cookie:", cookieError);
      throw new Error("Failed to set cookie");
    }

    // APIを使用する方法（バックアップとして残しておく）
    try {
      const response = await sessionAPI.session.$post({
        json: sessionData,
      });
      console.log("Server action: API response status:", response.status);

      if (!response.ok) {
        console.warn(
          "Server action: API response not OK, but cookie was set directly"
        );
      } else {
        console.log("Server action: API response OK");
      }
    } catch (apiError) {
      console.warn(
        "Server action: API call failed, but cookie was set directly:",
        apiError
      );
    }

    // パスを再検証して、変更を反映
    revalidatePath("/reading/[id]", "page");
    revalidatePath("/cards/[id]", "page");

    return { success: true };
  } catch (error) {
    console.error("Failed to save card to session:", error);
    // エラーの詳細情報を記録
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error("カードの保存に失敗しました");
  }
}

export async function getSessionCards(): Promise<Card[]> {
  try {
    // 直接cookieから取得
    const cookiesStore = await cookies();
    const sessionStr = cookiesStore.get("tarot-cards")?.value;
    if (sessionStr) {
      try {
        const sessionData = JSON.parse(sessionStr);
        return sessionData.card ? [sessionData.card] : [];
      } catch (parseError) {
        console.error("Failed to parse session data from cookie:", parseError);
      }
    }

    // APIからのフォールバック
    const response = await sessionAPI.session.$get();

    if (!response.ok) {
      throw new Error("Failed to get session data");
    }

    const data = await response.json();
    // cardがあれば配列に変換して返す（nullの場合は空配列）
    return data.card ? [data.card] : [];
  } catch (error) {
    console.error("Failed to get cards from session:", error);
    return [];
  }
}
