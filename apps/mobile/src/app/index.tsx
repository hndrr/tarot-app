import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DrawCardButton from "../components/DrawCardButton";

export default function Index() {
  return (
    <LinearGradient
      colors={["#1e293b", "#4338ca"]} // スレート900からインディゴ900に対応
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <Text className="text-3xl font-bold text-white mb-8">タロット占い</Text>

      <View className="w-96 h-96 rounded-lg overflow-hidden mb-8">
        <Image
          source={require("../assets/images/cover.png")}
          resizeMode="cover"
          className="w-full h-full"
        />
      </View>

      <Text className="text-xl text-purple-100 mb-8">
        今日のあなたの運勢は...?
      </Text>

      <DrawCardButton />
    </LinearGradient>
  );
}
