import React from "react"; // Import React
// import Image from "next/image"; // Use standard img tag instead
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
        {/* Replace Next.js Image with standard img tag for compatibility */}
        <img
          src={imageSrc}
          alt={card.name}
          // Apply classes to mimic 'fill' and other styles from Next Image
          className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
          loading="lazy" // Use standard loading attribute
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
