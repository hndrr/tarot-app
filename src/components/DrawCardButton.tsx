"use client";

import { useRouter } from "next/navigation";
import { tarotCards } from "@/data/tarotCards";
import type { Card } from "@/lib/actions";

interface DrawCardButtonProps {
  variant?: "primary" | "secondary";
  label?: string;
}

export default function DrawCardButton({
  variant = "primary",
  label = "カードを引く",
}: DrawCardButtonProps) {
  const router = useRouter();

  const drawCard = async () => {
    // hasVisitedをリセット
    await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hasVisited: false,
      }),
    });

    const randomIndex = Math.floor(Math.random() * tarotCards.length);
    const selectedCard = tarotCards[randomIndex];
    const isReversed = Math.random() < 0.5;

    // タロットメッセージを生成
    const response = await fetch("/api/tarot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: selectedCard.name,
        meaning: selectedCard.meaning,
      }),
    });

    if (response.ok) {
      const { upright, reversed } = await response.json();
      const message = isReversed ? reversed : upright;

      // カード情報をcookieに保存
      const cardData: Card = {
        id: selectedCard.id,
        name: selectedCard.name,
        position: isReversed ? "reversed" : "upright",
        isReversed,
        message,
      };

      await fetch("/api/session/card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });
    }

    router.push(`/reading/${selectedCard.id}`);
  };

  return (
    <button
      onClick={drawCard}
      className={`${
        variant === "primary"
          ? "bg-purple-600 hover:bg-purple-700 py-4 px-8 text-lg mb-8"
          : "bg-slate-600 hover:bg-slate-700 py-2 px-6"
      } text-white font-bold rounded-full transition duration-300 inline-block`}
    >
      {label}
    </button>
  );
}
