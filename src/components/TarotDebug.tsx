"use client";

import { useEffect } from "react";
import { tarotAPI } from "@/lib/client";

interface TarotDebugProps {
  cardName: string;
  cardMeaning: string;
}

export default function TarotDebug({ cardName, cardMeaning }: TarotDebugProps) {
  useEffect(() => {
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
      } catch (error) {
        console.error("API Call Error:", error);
      }
    };

    fetchTarotMessage();
  }, [cardName, cardMeaning]);

  return null; // このコンポーネントは表示要素を持ちません
}
