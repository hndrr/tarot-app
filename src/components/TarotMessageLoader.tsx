"use client";

import { useEffect } from "react";
import { tarotAPI } from "@/lib/client";
import { sessionAPI } from "@/lib/client";

interface TarotMessageLoaderProps {
  cardId: number;
  cardName: string;
  cardMeaning: string;
  hasTarotMessage: boolean;
}

export default function TarotMessageLoader({
  cardId,
  cardName,
  cardMeaning,
  hasTarotMessage,
}: TarotMessageLoaderProps) {
  useEffect(() => {
    // 既にタロットメッセージが存在する場合は何もしない
    if (hasTarotMessage) {
      return;
    }

    const fetchTarotMessage = async () => {
      try {
        const response = await tarotAPI.tarot.$post({
          json: {
            name: cardName,
            meaning: cardMeaning,
          },
        });

        if (!response.ok) {
          console.error("タロットメッセージの取得に失敗しました");
          return;
        }

        const data = await response.json();

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
          // ページをリロード
          window.location.reload();
        }
      } catch (error) {
        console.error("タロットメッセージの取得に失敗しました:", error);
      }
    };

    fetchTarotMessage();
  }, [cardId, cardName, cardMeaning, hasTarotMessage]);

  return null;
}
