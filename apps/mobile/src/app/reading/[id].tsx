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
        <Text style={styles.text}>カードが見つかりません</Text>
        <Pressable
          onPress={() => navigation.navigate("index")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>トップに戻る</Text>
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
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>あなたのカード</Text>
            <Text style={styles.subtitle}>
              このカードがあなたに伝えるメッセージ
            </Text>
          </View>

          <View style={styles.cardContainer}>
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
              style={styles.detailButton}
            >
              <Text style={styles.buttonText}>詳細を見る</Text>
            </Pressable>
          </View>

          <View style={styles.buttonGroup}>
            <Pressable onPress={drawCard} style={styles.drawAgainButton}>
              <Text style={styles.buttonText}>もう一度引く</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("index")}
              style={styles.homeButton}
            >
              <Text style={styles.buttonText}>トップに戻る</Text>
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
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#c4b5fd",
  },
  cardContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    marginBottom: 24,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#7c3aed",
    borderRadius: 9999,
  },
  detailButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#7c3aed",
    borderRadius: 9999,
  },
  buttonGroup: {
    width: "100%",
    gap: 16,
  },
  drawAgainButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#475569",
    borderRadius: 9999,
    alignItems: "center",
  },
  homeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
