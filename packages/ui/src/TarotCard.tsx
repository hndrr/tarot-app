import React from "react"; // Import React
import Image from "next/image";
import type { TarotCard as TarotCardType } from "@repo/types"; // Use shared type

type TarotCardProps = {
  card: TarotCardType; // Use imported type
  isReversed: boolean;
};

export const TarotCard = ({ card, isReversed }: TarotCardProps) => {
  // Export named component
  // Construct the image path assuming it's relative to the public directory
  // This might need adjustment based on final asset location strategy
  const imageSrc = card.image.startsWith("/")
    ? card.image
    : `/assets/cards/${card.image}.webp`;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative aspect-[2/3] w-64 mb-6 ${
          isReversed ? "rotate-180" : "" // Use ternary for clarity
        }`}
      >
        <Image
          src={imageSrc} // Use constructed path
          alt={card.name}
          fill
          className="rounded-lg object-cover shadow-lg"
          priority // Keep priority if needed
        />
      </div>
      <h3 className="text-3xl font-bold mb-3">{card.name}</h3>
      <span className="text-xl text-gray-200 mb-3 font-bold">
        {isReversed ? "逆位置" : "正位置"}
      </span>
      <p className="text-xl text-gray-200">{card.meaning}</p>
    </div>
  );
};
