"use server";

import { Card } from "@/types";
import { revalidatePath } from "next/cache";
import { sessionAPI } from "@/lib/client";

// 以下の関数はサーバー側でのみ実行され、クライアント側ではsessionAPIを使用

export async function saveCardToSession(
  card: Card,
  hasVisited: boolean = true
) {
  try {
    console.log(
      "Server action: saveCardToSession called with card:",
      JSON.stringify(card)
    ); // デバッグ用
    console.log("Server action: hasVisited:", hasVisited); // デバッグ用

    // sessionAPIクライアントを使用してカードデータを保存
    const response = await sessionAPI.api.session.$post({
      json: {
        card: {
          ...card,
          isReversed: card.isReversed, // 逆位置の情報を明示的に含める
          position: card.isReversed ? "reversed" : "upright", // 位置情報も更新
        },
        hasVisited: hasVisited, // ユーザーが訪問したかどうかのフラグ
      },
    });

    if (!response.ok) {
      throw new Error("Failed to save session data");
    }

    // パスを再検証して、変更を反映
    revalidatePath("/reading/[id]");
    revalidatePath("/cards/[id]"); // cards/[id]ページも再検証

    return { success: true };
  } catch (error) {
    console.error("Failed to save card to session:", error);
    throw new Error("カードの保存に失敗しました");
  }
}

export async function getSessionCards(): Promise<Card[]> {
  try {
    const response = await sessionAPI.api.session.$get();

    if (!response.ok) {
      throw new Error("Failed to get session data");
    }

    const data = await response.json();
    return data.cards || [];
  } catch (error) {
    console.error("Failed to get cards from session:", error);
    return [];
  }
}
