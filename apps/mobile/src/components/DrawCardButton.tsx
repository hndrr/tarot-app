import React from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { tarotCards } from "../data/tarotCards";

export default function DrawCardButton() {
  const router = useRouter();

  const drawCard = () => {
    const randomIndex = Math.floor(Math.random() * tarotCards.length);
    const selectedCard = tarotCards[randomIndex];
    router.replace({
      pathname: "/reading/[id]",
      params: {
        id: selectedCard.id,
        reversed: Math.random() < 0.5 ? "true" : "false",
        back: "false",
      },
    });
  };

  return (
    <Pressable
      onPress={drawCard}
      className="bg-purple-600 py-4 px-8 rounded-full mb-8"
    >
      <Text className="text-white text-lg text-center font-bold">
        カードを引く
      </Text>
    </Pressable>
  );
}
