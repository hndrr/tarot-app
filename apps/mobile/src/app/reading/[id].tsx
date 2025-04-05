import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { TarotCard } from "../../components/TarotCard";
import { tarotCards } from "../../data/tarotCards";
import { useRouter } from "expo-router";
import { TarotLoading } from "../../components/TarotLoading";
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

export default function Reading() {
  const router = useRouter();
  const route = useRoute<RouteProp<ReadingRouteParams, "reading">>();
  const navigation = useNavigation<NavigationProps>();
  const { id, reversed, back } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | null>(null);
  const isReversed = reversed === "true";
  const isBack = back === "true";

  useEffect(() => {
    const fetchCard = async () => {
      if (!isBack) {
        await new Promise((resolve) => setTimeout(resolve, 6000)); // 6秒の遅延
      }
      // foundCardがundefinedの場合にnullを設定
      const foundCard = tarotCards.find((card) => card.id === parseInt(id));
      setCard(foundCard || null);
      setLoading(false);
    };

    fetchCard();
  }, [id, isBack]);

  if (loading) {
    return <TarotLoading />;
  }

  if (!card) {
    return (
      <LinearGradient colors={["#5b21b6", "#4338ca"]} style={styles.container}>
        <Text className="text-lg text-white">カードが見つかりません</Text>
        <Pressable
          onPress={() => navigation.navigate("index")}
          className="mt-4 py-2 px-4 bg-purple-600 rounded-full"
        >
          <Text className="text-white text-center">トップに戻る</Text>
        </Pressable>
      </LinearGradient>
    );
  }

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
    <LinearGradient colors={["#1e293b", "#4338ca"]} style={styles.container}>
      <ScrollView>
        <View className="px-5 py-10 items-center">
          <View className="mb-6 items-center">
            <Text className="text-2xl font-bold text-white mb-2">
              あなたのカード
            </Text>
            <Text className="text-base text-purple-200">
              このカードがあなたに伝えるメッセージ
            </Text>
          </View>

          <View className="bg-white/10 rounded-lg p-6 w-full max-w-[400px] mb-6 items-center">
            <TarotCard card={card} isReversed={isReversed} />
            <Pressable
              onPress={() =>
                router.replace({
                  pathname: "/details/[id]",
                  params: {
                    id: card.id,
                    reversed: reversed,
                    back: "false",
                  },
                })
              }
              className="mt-4 py-3 px-6 bg-purple-600 rounded-full"
            >
              <Text className="text-white text-center">詳細を見る</Text>
            </Pressable>
          </View>

          <View className="w-full gap-4">
            <Pressable
              onPress={drawCard}
              className="py-3 px-6 bg-slate-600 rounded-full items-center"
            >
              <Text className="text-white text-center">もう一度引く</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("index")}
              className="py-3 px-6 rounded-full items-center"
            >
              <Text className="text-white text-center">トップに戻る</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
