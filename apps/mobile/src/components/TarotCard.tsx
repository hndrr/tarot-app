import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";
import type { Card } from "../types";

type TarotCardProps = {
  card: Card;
  isReversed: boolean;
};

// カード画像のマッピング
export const imagePaths: {
  [key: string]: ImageSourcePropType;
} = {
  fool: require("../assets/images/cards/fool.webp"),
  magician: require("../assets/images/cards/magician.webp"),
  "high-priestess": require("../assets/images/cards/high-priestess.webp"),
  empress: require("../assets/images/cards/empress.webp"),
  emperor: require("../assets/images/cards/emperor.webp"),
  hierophant: require("../assets/images/cards/hierophant.webp"),
  lovers: require("../assets/images/cards/lovers.webp"),
  chariot: require("../assets/images/cards/chariot.webp"),
  strength: require("../assets/images/cards/strength.webp"),
  hermit: require("../assets/images/cards/hermit.webp"),
  "wheel-of-fortune": require("../assets/images/cards/wheel-of-fortune.webp"),
  justice: require("../assets/images/cards/justice.webp"),
  "hanged-man": require("../assets/images/cards/hanged-man.webp"),
  death: require("../assets/images/cards/death.webp"),
  temperance: require("../assets/images/cards/temperance.webp"),
  devil: require("../assets/images/cards/devil.webp"),
  tower: require("../assets/images/cards/tower.webp"),
  star: require("../assets/images/cards/star.webp"),
  moon: require("../assets/images/cards/moon.webp"),
  sun: require("../assets/images/cards/sun.webp"),
  judgement: require("../assets/images/cards/judgement.webp"),
  world: require("../assets/images/cards/world.webp"),
};

export const TarotCard = ({ card, isReversed }: TarotCardProps) => {
  // カード名から画像を解決
  const resolvedImage = imagePaths[card.image];

  if (!resolvedImage) {
    console.warn(`Image not found for card. Path: ${card.image}`);
  }

  return (
    <View className="flex-col items-center">
      <View
        className={`aspect-[2/3] w-64 mb-6 ${isReversed ? "rotate-180" : ""}`}
      >
        {resolvedImage && (
          <Image
            source={resolvedImage}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        )}
      </View>
      <Text className="text-2xl font-bold mb-3 text-white">{card.name}</Text>
      <Text className="text-xl text-slate-200 mb-3 font-bold">
        {isReversed ? "逆位置" : "正位置"}
      </Text>
      <Text className="text-xl text-slate-200 text-center">{card.meaning}</Text>
    </View>
  );
};
