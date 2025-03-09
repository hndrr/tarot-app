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
    console.log("Server action: card received:", JSON.stringify(card));
    console.log("Server action: hasVisited:", hasVisited);

    // カードデータを直接使用（既にSaveCardコンポーネントで処理済み）
    const response = await sessionAPI.api.session.$post({
      json: {
        card: card,
        hasVisited: hasVisited,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to save session data");
    }

    // パスを再検証して、変更を反映
    revalidatePath("/reading/[id]", "page");
    revalidatePath("/cards/[id]", "page");

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
    // cardがあれば配列に変換して返す（nullの場合は空配列）
    return data.card ? [data.card] : [];
  } catch (error) {
    console.error("Failed to get cards from session:", error);
    return [];
  }
}
