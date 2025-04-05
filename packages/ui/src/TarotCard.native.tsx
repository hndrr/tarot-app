import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native"; // Add StyleSheet
import type { TarotCard as TarotCardType } from "@repo/types"; // Use shared type

type TarotCardProps = {
  card: TarotCardType; // Use imported type
  isReversed: boolean;
};

// Keep the image path resolution logic specific to mobile for now
// This might need adjustment depending on how assets are handled in the monorepo
// Export imagePaths for use in other mobile components if needed
export const imagePaths: {
  [key: string]: ImageSourcePropType;
} = {
  fool: require("../../../apps/mobile/src/assets/images/cards/fool.webp"), // Adjust path relative to this file's new location
  magician: require("../../../apps/mobile/src/assets/images/cards/magician.webp"),
  "high-priestess": require("../../../apps/mobile/src/assets/images/cards/high-priestess.webp"),
  empress: require("../../../apps/mobile/src/assets/images/cards/empress.webp"),
  emperor: require("../../../apps/mobile/src/assets/images/cards/emperor.webp"),
  hierophant: require("../../../apps/mobile/src/assets/images/cards/hierophant.webp"),
  lovers: require("../../../apps/mobile/src/assets/images/cards/lovers.webp"),
  chariot: require("../../../apps/mobile/src/assets/images/cards/chariot.webp"),
  strength: require("../../../apps/mobile/src/assets/images/cards/strength.webp"),
  hermit: require("../../../apps/mobile/src/assets/images/cards/hermit.webp"),
  "wheel-of-fortune": require("../../../apps/mobile/src/assets/images/cards/wheel-of-fortune.webp"),
  justice: require("../../../apps/mobile/src/assets/images/cards/justice.webp"),
  "hanged-man": require("../../../apps/mobile/src/assets/images/cards/hanged-man.webp"),
  death: require("../../../apps/mobile/src/assets/images/cards/death.webp"),
  temperance: require("../../../apps/mobile/src/assets/images/cards/temperance.webp"),
  devil: require("../../../apps/mobile/src/assets/images/cards/devil.webp"),
  tower: require("../../../apps/mobile/src/assets/images/cards/tower.webp"),
  star: require("../../../apps/mobile/src/assets/images/cards/star.webp"),
  moon: require("../../../apps/mobile/src/assets/images/cards/moon.webp"),
  sun: require("../../../apps/mobile/src/assets/images/cards/sun.webp"),
  judgement: require("../../../apps/mobile/src/assets/images/cards/judgement.webp"),
  world: require("../../../apps/mobile/src/assets/images/cards/world.webp"),
};

export const TarotCard = ({ card, isReversed }: TarotCardProps) => {
  // Export named component
  // Extract card name from the image path (e.g., "tower" from "/assets/cards/tower.webp")
  const cardName = card.image.split("/").pop()?.split(".")[0];

  // Resolve image using the extracted card name as the key
  const resolvedImage = cardName ? imagePaths[cardName] : undefined;

  if (!resolvedImage) {
    // Log the original path and the extracted name for debugging
    console.warn(
      `Image not found for card. Path: ${card.image}, Extracted Name: ${cardName}`
    );
    // Optionally return a placeholder or null
  }

  return (
    <View className="flex flex-col items-center">
      <View
        className={`relative aspect-[2/3] w-64 mb-6 ${
          isReversed ? "rotate-180" : ""
        }`}
      >
        {resolvedImage && ( // Render image only if found
          <Image
            source={resolvedImage}
            className="w-full h-full rounded-lg shadow-lg"
            resizeMode="cover"
          />
        )}
      </View>
      <Text className="text-3xl font-bold mb-3 text-white">{card.name}</Text>
      <Text className="text-xl text-gray-200 mb-3 font-bold">
        {isReversed ? "逆位置" : "正位置"}
      </Text>
      <Text className="text-xl text-gray-200 text-center">{card.meaning}</Text>
    </View>
  );
};
