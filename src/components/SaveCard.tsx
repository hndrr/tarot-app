"use client";

import { useEffect } from "react";
import { sessionAPI } from "@/lib/client";
import { Card } from "@/types";

interface SaveCardProps {
  card: Card;
  isFirstVisit?: boolean;
}

export default function SaveCard({ card, isFirstVisit = true }: SaveCardProps) {
  useEffect(() => {
    const saveSession = async () => {
      try {
        const response = await sessionAPI.saveSession({
          card,
          hasVisited: !isFirstVisit,
        });

        if (!response.ok) {
          throw new Error("セッションの保存に失敗しました");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("セッションの保存に失敗しました");
        }
      } catch (error) {
        console.error("Failed to save session:", error);
        // エラー処理をここに追加することもできます（例：トースト通知など）
      }
    };

    saveSession();
  }, [card, isFirstVisit]);

  return null;
}
