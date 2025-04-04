"use client";

import { useEffect } from "react";

interface Card {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
}

interface SaveCardProps {
  card: Card;
  isFirstVisit?: boolean;
}

export default function SaveCard({ card, isFirstVisit = true }: SaveCardProps) {
  useEffect(() => {
    const saveSession = async () => {
      try {
        const response = await fetch("/api/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            card,
            hasVisited: true,
          }),
        });

        if (!response.ok) {
          throw new Error("セッションの保存に失敗しました");
        }
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    };

    saveSession();
  }, [card, isFirstVisit]);

  return null;
}
