import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DrawCardButton from "../components/DrawCardButton";

export default function Index() {
  return (
    <LinearGradient
      colors={["#1e293b", "#4338ca"]} // スレート900からインディゴ900に対応
      style={styles.container}
    >
      <Text style={styles.title}>タロット占い</Text>

      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/cover.png")}
          resizeMode="cover"
          style={styles.image}
        />
      </View>

      <Text style={styles.subtitle}>今日のあなたの運勢は...?</Text>

      <DrawCardButton />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 32,
  },
  imageContainer: {
    width: 384,
    height: 384,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 32,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  subtitle: {
    fontSize: 20,
    color: "#ddd6fe",
    marginBottom: 32,
  },
});
