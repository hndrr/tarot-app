import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
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
    <Pressable onPress={drawCard} style={styles.button}>
      <Text style={styles.text}>カードを引く</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#7c3aed",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    marginBottom: 32,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
