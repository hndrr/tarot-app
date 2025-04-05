import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { tarotCards } from "../../data/tarotCards";
import { imagePaths } from "../../components/TarotCard";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { generateTarotMessage } from "../../lib/generateTarotMessageGemini";
import { Card } from "../../types";

// Routeの型定義
type ReadingRouteParams = {
  reading: {
    id: string;
    reversed?: string;
    back?: string;
  };
  CardDetails: {
    id: number;
    reversed: boolean;
  };
  index: undefined;
};

type NavigationProps = {
  navigate: (screen: keyof ReadingRouteParams, params?: any) => void;
  replace: (screen: keyof ReadingRouteParams, params?: any) => void;
};

export default function CardDetail() {
  const route = useRoute<RouteProp<ReadingRouteParams, "reading">>();
  const navigation = useNavigation<NavigationProps>();
  const { id, reversed } = route.params as { id: string; reversed?: string };
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | null>(null);
  const [tarotMessage, setTarotMessage] = useState<{
    upright: string;
    reversed: string;
  } | null>(null);
  const isReversed = reversed === "true";

  useEffect(() => {
    const fetchCard = async () => {
      const foundCard = tarotCards.find((card) => card.id === parseInt(id));
      setCard(foundCard || null);

      if (foundCard) {
        try {
          const message = await generateTarotMessage(
            foundCard.name,
            foundCard.meaning
          );
          setTarotMessage(message);
        } catch (error) {
          console.error("文言生成エラー:", error);
        }
      }

      setLoading(false);
    };

    fetchCard();
  }, [id]);

  if (loading) {
    return (
      <LinearGradient colors={["#1e293b", "#4338ca"]} style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-lg text-white mt-4">
          カードを読み込んでいます...
        </Text>
      </LinearGradient>
    );
  }

  if (!card) {
    return (
      <LinearGradient colors={["#1e293b", "#4338ca"]} style={styles.container}>
        <Text className="text-lg text-white">カードが見つかりません</Text>
        <Pressable
          onPress={() => navigation.navigate("index")}
          className="mt-4 py-2 px-4 bg-purple-600 rounded-full"
        >
          <Text className="text-white">トップに戻る</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  // カード画像を取得
  const resolvedImage = imagePaths[card.image];

  return (
    <LinearGradient colors={["#1e293b", "#4338ca"]} style={styles.container}>
      <ScrollView>
        <View className="p-4">
          <Pressable
            onPress={() =>
              router.replace({
                pathname: "/reading/[id]",
                params: {
                  id: card.id,
                  reversed: reversed,
                  back: "true",
                },
              })
            }
            className="mb-8"
          >
            <Text className="text-white">戻る</Text>
          </Pressable>

          <View className="flex-col items-center gap-10">
            <View
              className={`aspect-[2/3] w-64 ${isReversed ? "rotate-180" : ""}`}
            >
              {resolvedImage && (
                <Image
                  source={resolvedImage}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
              )}
            </View>

            <View className="flex-1">
              <Text className="mb-4 text-white text-center">
                <Text className="text-2xl font-bold">{card.name} </Text>
                <Text className="text-xl font-normal">
                  {isReversed ? `逆位置` : `正位置`}
                </Text>
              </Text>
              <View className="bg-white/10 rounded-lg p-6">
                <Text className="text-xl font-semibold mb-2 text-white">
                  カードの意味
                </Text>
                <Text className="text-slate-200 mb-6">{card.meaning}</Text>
                <Text className="text-xl font-semibold mb-2 text-white">
                  詳細な解釈
                </Text>
                <View className="mt-4">
                  <View>
                    <Text className="text-slate-200">
                      {tarotMessage
                        ? isReversed
                          ? tarotMessage.reversed
                          : tarotMessage.upright
                        : "生成中..."}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
