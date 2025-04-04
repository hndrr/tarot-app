import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { tarotCards } from "data/tarotCards";
import { imagePaths } from "components/TarotCard";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { generateTarotMessage } from "lib/generateTarotMessageGemini";

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

type Card = {
  id: number;
  name: string;
  image: string;
  meaning: string;
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
  const resolvedImage = card ? imagePaths[card.image] : null;
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
      <LinearGradient
        colors={["#1e293b", "#4338ca"]}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-lg text-white mt-4">
          カードを読み込んでいます...
        </Text>
      </LinearGradient>
    );
  }

  if (!card) {
    return (
      <LinearGradient
        colors={["#1e293b", "#4338ca"]}
        className="flex-1 justify-center items-center"
      >
        <Text className="text-lg text-white">カードが見つかりません</Text>
        <Pressable
          onPress={() => navigation.navigate("index")}
          className="mt-4 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700"
        >
          <Text className="text-white">トップに戻る</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1e293b", "#4338ca"]} className="flex-1">
      <ScrollView>
        <View className="container mx-auto px-4 py-10">
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
            className="inline-block mb-8 text-purple-300 hover:text-purple-100"
          >
            <Text className="text-white">戻る</Text>
          </Pressable>

          <View className="flex flex-col md:flex-row items-center gap-10">
            <View
              className={`relative aspect-[2/3] w-64 ${
                isReversed ? "rotate-180" : ""
              }`}
            >
              <Image
                source={resolvedImage}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>

            <View className="flex-1">
              <Text className="mb-4 text-white text-center">
                <Text className="text-3xl font-bold">{card.name} </Text>
                <Text className="text-2xl font-normal">
                  {isReversed ? `逆位置` : `正位置`}
                </Text>
              </Text>
              <View className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Text className="text-xl font-semibold mb-2 text-white">
                  カードの意味
                </Text>
                <Text className="text-gray-200">{card.meaning}</Text>
                <Text className="text-xl font-semibold mt-6 mb-2 text-white">
                  詳細な解釈
                </Text>
                <View className="space-y-4">
                  <View>
                    <Text className="text-gray-200">
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
