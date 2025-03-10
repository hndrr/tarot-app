"use client";

import { useEffect } from "react";
import type { Card } from "@/lib/actions";
import { client } from "@/lib/client";

interface SaveCardProps {
  card: Card;
  isFirstVisit?: boolean;
}

export default function SaveCard({ card, isFirstVisit = true }: SaveCardProps) {
  useEffect(() => {
    const saveSession = async () => {
      try {
        const response = await client.api.session.$post({
          json: {
            card,
            hasVisited: true,
          },
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
