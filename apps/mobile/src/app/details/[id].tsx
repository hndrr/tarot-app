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
        <Text style={styles.loadingText}>カードを読み込んでいます...</Text>
      </LinearGradient>
    );
  }

  if (!card) {
    return (
      <LinearGradient colors={["#1e293b", "#4338ca"]} style={styles.container}>
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

  // カード画像を取得
  const resolvedImage = imagePaths[card.image];

  return (
    <LinearGradient colors={["#1e293b", "#4338ca"]} style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
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
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>戻る</Text>
          </Pressable>

          <View style={styles.cardDetail}>
            <View
              style={[styles.imageContainer, isReversed && styles.reversed]}
            >
              {resolvedImage && (
                <Image
                  source={resolvedImage}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.cardTitle}>
                <Text style={styles.cardName}>{card.name} </Text>
                <Text style={styles.cardPosition}>
                  {isReversed ? `逆位置` : `正位置`}
                </Text>
              </Text>
              <View style={styles.meaningContainer}>
                <Text style={styles.sectionTitle}>カードの意味</Text>
                <Text style={styles.meaningText}>{card.meaning}</Text>
                <Text style={styles.sectionTitle}>詳細な解釈</Text>
                <View style={styles.interpretationContainer}>
                  <View>
                    <Text style={styles.interpretationText}>
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
  },
  content: {
    padding: 16,
  },
  backButton: {
    marginBottom: 32,
  },
  backButtonText: {
    color: "white",
  },
  cardDetail: {
    flexDirection: "column",
    alignItems: "center",
    gap: 40,
  },
  imageContainer: {
    aspectRatio: 2 / 3,
    width: 256,
  },
  reversed: {
    transform: [{ rotate: "180deg" }],
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: 16,
    color: "white",
    textAlign: "center",
  },
  cardName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cardPosition: {
    fontSize: 20,
    fontWeight: "normal",
  },
  meaningContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "white",
  },
  meaningText: {
    color: "#e2e8f0",
    marginBottom: 24,
  },
  interpretationContainer: {
    marginTop: 16,
  },
  interpretationText: {
    color: "#e2e8f0",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  loadingText: {
    fontSize: 18,
    color: "white",
    marginTop: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#7c3aed",
    borderRadius: 9999,
  },
  buttonText: {
    color: "white",
  },
});
