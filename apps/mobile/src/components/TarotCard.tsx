import React from "react";
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  StyleSheet,
} from "react-native";
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
    <View style={styles.container}>
      <View style={[styles.imageContainer, isReversed && styles.reversed]}>
        {resolvedImage && (
          <Image
            source={resolvedImage}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
      <Text style={styles.name}>{card.name}</Text>
      <Text style={styles.position}>{isReversed ? "逆位置" : "正位置"}</Text>
      <Text style={styles.meaning}>{card.meaning}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  imageContainer: {
    aspectRatio: 2 / 3,
    width: 256,
    marginBottom: 24,
  },
  reversed: {
    transform: [{ rotate: "180deg" }],
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "white",
  },
  position: {
    fontSize: 20,
    color: "#e2e8f0",
    marginBottom: 12,
    fontWeight: "bold",
  },
  meaning: {
    fontSize: 20,
    color: "#e2e8f0",
    textAlign: "center",
  },
});
