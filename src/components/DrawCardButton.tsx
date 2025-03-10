"use client";

import { useRouter } from "next/navigation";
import { tarotCards } from "@/data/tarotCards";
import { sessionAPI } from "@/lib/client";

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
    try {
      console.log("DrawCardButton: Resetting session data");

      // hasVisitedをリセットし、カード情報も完全にnullにする
      const result = await sessionAPI.session.$post({
        json: {
          hasVisited: false,
          card: null, // カード情報をnullにリセット（undefinedではなく）
        },
      });

      if (!result.ok) {
        console.error("セッション保存中にエラーが発生しました");
      } else {
        console.log("DrawCardButton: Session reset successful");
      }

      // ランダムにカードを選択
      const randomIndex = Math.floor(Math.random() * tarotCards.length);
      const selectedCard = tarotCards[randomIndex];
      console.log(
        "DrawCardButton: Selected card:",
        JSON.stringify(selectedCard)
      );
      console.log(
        "DrawCardButton: Navigating to:",
        `/reading/${selectedCard.id}`
      );

      // 選択したカードのページに遷移
      router.push(`/reading/${selectedCard.id}`);
    } catch (error) {
      console.error("カードを引く際にエラーが発生しました:", error);
    }
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
