import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { TarotCard } from '../../components/TarotCard';
import { tarotCards } from '../../data/tarotCards';
import { useRouter } from 'expo-router';
import { TarotLoading } from '../../components/TarotLoading';
import { Card } from '../../types';

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
  const route = useRoute<RouteProp<ReadingRouteParams, 'reading'>>();
  const navigation = useNavigation<NavigationProps>();
  const { id, reversed, back } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | null>(null);
  const isReversed = reversed === 'true';
  const isBack = back === 'true';

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
      <LinearGradient colors={['#5b21b6', '#4338ca']} style={styles.container}>
        <Text className="text-lg text-white">カードが見つかりません</Text>
        <Pressable
          onPress={() => navigation.navigate('index')}
          className="mt-4 rounded-full bg-purple-600 px-4 py-2">
          <Text className="text-center text-white">トップに戻る</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  const drawCard = () => {
    const randomIndex = Math.floor(Math.random() * tarotCards.length);
    const selectedCard = tarotCards[randomIndex];
    router.replace({
      pathname: '/reading/[id]',
      params: {
        id: selectedCard.id,
        reversed: Math.random() < 0.5 ? 'true' : 'false',
        back: 'false',
      },
    });
  };

  return (
    <LinearGradient colors={['#1e293b', '#4338ca']} style={styles.container}>
      <ScrollView>
        <View className="items-center px-5 py-10">
          <View className="mb-6 items-center">
            <Text className="mb-2 text-2xl font-bold text-white">あなたのカード</Text>
            <Text className="text-base text-purple-200">このカードがあなたに伝えるメッセージ</Text>
          </View>

          <View className="mb-6 w-full items-center rounded-lg bg-white/10 p-6">
            <TarotCard card={card} isReversed={isReversed} />
            <Pressable
              onPress={() =>
                router.replace({
                  pathname: '/details/[id]',
                  params: {
                    id: card.id,
                    reversed: reversed,
                    back: 'false',
                  },
                })
              }
              className="mt-4 w-full rounded-full bg-purple-600 px-6 py-3">
              <Text className="text-center text-lg text-white">詳細を見る</Text>
            </Pressable>
          </View>

          <View className="w-full gap-4">
            <Pressable
              onPress={drawCard}
              className="items-center rounded-full bg-slate-600 px-6 py-3">
              <Text className="text-center text-white">もう一度引く</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('index')}
              className="items-center rounded-full px-6 py-3">
              <Text className="text-center text-white">トップに戻る</Text>
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
