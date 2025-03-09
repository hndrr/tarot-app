"use client";

import { useEffect } from "react";
import { tarotAPI } from "@/lib/client";
import { sessionAPI } from "@/lib/client";

interface TarotDebugProps {
  cardId: number;
  cardName: string;
  cardMeaning: string;
  hasTarotMessage: boolean;
}

export default function TarotDebug({
  cardId,
  cardName,
  cardMeaning,
  hasTarotMessage,
}: TarotDebugProps) {
  useEffect(() => {
    // 既にタロットメッセージが存在する場合は何もしない
    if (hasTarotMessage) {
      console.log("Tarot message already exists, skipping API call");
      return;
    }

    const fetchTarotMessage = async () => {
      try {
        console.log("=== Client Side Debug: Fetching Tarot Message ===");
        console.log("Card Data:", { name: cardName, meaning: cardMeaning });

        const response = await tarotAPI.tarot.$post({
          json: {
            name: cardName,
            meaning: cardMeaning,
          },
        });

        console.log("API Response Status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", errorText);
          return;
        }

        const data = await response.json();
        console.log("API Response Data:", data);

        // セッションに保存
        const saveResponse = await sessionAPI.session.$post({
          json: {
            tarotMessage: {
              cardId,
              message: data,
            },
          },
        });

        if (saveResponse.ok) {
          console.log("Tarot message saved to session");
          // ページをリロード
          window.location.reload();
        }
      } catch (error) {
        console.error("API Call Error:", error);
      }
    };

    fetchTarotMessage();
  }, [cardId, cardName, cardMeaning, hasTarotMessage]);

  return null; // このコンポーネントは表示要素を持ちません
}
