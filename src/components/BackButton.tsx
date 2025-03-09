"use client";

import { useRouter } from "next/navigation";
import { sessionAPI } from "@/lib/client";
import { Card } from "@/types";

interface BackButtonProps {
  id: string;
}

export default function BackButton({ id }: BackButtonProps) {
  const router = useRouter();

  const handleBack = async () => {
    // 現在のセッションデータを取得
    try {
      console.log("BackButton: Getting current session data");

      // まず現在のセッションデータを取得
      const sessionResponse = await sessionAPI.api.session.$get();
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        console.log(
          "BackButton: Current session data:",
          JSON.stringify(sessionData)
        );

        // hasVisitedフラグをtrueに設定して保存（既存のカード情報は保持）
        const postData: { hasVisited: boolean; card?: Card } = {
          hasVisited: true,
        };

        // 既存のカード情報があれば追加（isReversedを確実に真偽値に変換）
        if (sessionData.card) {
          const cardData = sessionData.card as Card;
          const isReversed = Boolean(cardData.isReversed);

          postData.card = {
            id: cardData.id,
            name: cardData.name,
            isReversed: isReversed,
            position: isReversed ? "reversed" : "upright",
            tarotMessage: cardData.tarotMessage,
          };
        }

        console.log("BackButton: Posting data:", JSON.stringify(postData));

        const response = await sessionAPI.api.session.$post({
          json: postData,
        });

        if (!response.ok) {
          console.error("セッションの保存に失敗しました");
        } else {
          console.log("BackButton: Session update successful");
        }
      } else {
        console.error("セッションの取得に失敗しました");
      }
    } catch (error) {
      console.error("セッションの操作に失敗:", error);
    }

    // 保存後にページ遷移
    router.replace(`/reading/${id}`);
  };

  return (
    <button
      onClick={handleBack}
      className="inline-block mb-8 text-purple-300 hover:text-purple-100 transition duration-300"
    >
      戻る
    </button>
  );
}
