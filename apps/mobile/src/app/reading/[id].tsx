import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { TarotCard } from "components/TarotCard"; // TarotCardコンポーネントをNative版に合わせて作成
import { tarotCards } from "data/tarotCards";
import { useRouter } from "expo-router";
import { TarotLoading } from "components/TarotLoading";

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
  }, [id, back]);

  if (loading) {
    return <TarotLoading />;
  }

  if (!card) {
    return (
      <LinearGradient
        colors={["#5b21b6", "#4338ca"]}
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
    <LinearGradient
      colors={["#1e293b", "#4338ca"]}
      className="flex-1 px-5 py-10 justify-center items-center"
    >
      <ScrollView>
        <View className="container mx-auto px-4 py-10">
          <View className="mb-6 text-center">
            <Text className="text-3xl font-bold text-white mb-2">
              あなたのカード
            </Text>
            <Text className="text-purple-300">
              このカードがあなたに伝えるメッセージ
            </Text>
          </View>

          <View className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mb-6 w-full">
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
              className="mt-4 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700"
            >
              <Text className="text-white text-center">詳細を見る</Text>
            </Pressable>
          </View>

          <View className="gap-4">
            <Pressable
              onPress={drawCard}
              className="px-6 py-3 rounded-full bg-slate-600 hover:bg-slate-700"
            >
              <Text className="text-white text-center">もう一度引く</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("index")}
              className="px-6 py-3 rounded-full text-purple-300 hover:text-purple-100"
            >
              <Text className="text-center text-white">トップに戻る</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
