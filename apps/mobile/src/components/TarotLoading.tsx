import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const TarotLoading = () => {
  return (
    <LinearGradient colors={["#1e293b", "#4338ca"]} style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text className="text-lg text-white mt-4">
        カードを読み込んでいます...
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
