import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { tarotCards } from '../../data/tarotCards';
import { imagePaths } from '../../components/TarotCard';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
// import { generateTarotMessage } from '../../lib/generateTarotMessageGemini'; // 元のインポートをコメントアウト
import { generateTarotMessageFromWebApi } from '@repo/tarot-logic'; // 正しいパッケージ名をインポート
import { Card } from '../../types';
import { ChevronLeftIcon } from 'lucide-react-native';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: (screen: keyof ReadingRouteParams, params?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  replace: (screen: keyof ReadingRouteParams, params?: any) => void;
};

export default function CardDetail() {
  const route = useRoute<RouteProp<ReadingRouteParams, 'reading'>>();
  const navigation = useNavigation<NavigationProps>();
  const { id, reversed } = route.params as { id: string; reversed?: string };
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | null>(null);
  const [tarotMessage, setTarotMessage] = useState<{
    upright: string;
    reversed: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isReversed = reversed === 'true';

  // 強制的に再レンダリングするためのキー
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const fetchCard = async () => {
      const foundCard = tarotCards.find((card) => card.id === parseInt(id));
      setCard(foundCard || null);

      if (foundCard) {
        try {
          setError(null); // エラー状態をリセット
          // 新しい関数を使用
          console.log(
            '[CardDetail] Calling generateTarotMessageFromWebApi for card:',
            foundCard.name
          ); // ログ追加
          const message = await generateTarotMessageFromWebApi(foundCard.name, foundCard.meaning);
          console.log('[CardDetail] Received message:', message); // ログ追加
          // 明示的にオブジェクトを作成して状態を更新
          setTarotMessage({
            upright: message.upright || '正位置の解釈を取得できませんでした',
            reversed: message.reversed || '逆位置の解釈を取得できませんでした',
          });
          // 強制的に再レンダリングを促す
          setLoading(false);
          // キーを更新して再マウントを強制
          setRenderKey((prev) => prev + 1);
        } catch (error) {
          console.error('[CardDetail] Error generating tarot message:', error); // ログ追加 (詳細化)
          // エラーオブジェクト全体をログに出力
          console.error(
            '[CardDetail] Full error object:',
            JSON.stringify(error, Object.getOwnPropertyNames(error))
          );
          // setError(error instanceof Error ? error.message : '文言生成に失敗しました');
        }
      }

      setLoading(false);
    };

    fetchCard();
  }, [id]);

  if (loading) {
    return (
      <LinearGradient
        colors={['#1e293b', '#4338ca']}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-lg text-white">カードを読み込んでいます...</Text>
      </LinearGradient>
    );
  }

  if (!card) {
    return (
      <LinearGradient colors={['#1e293b', '#4338ca']} style={styles.container}>
        <Text className="text-lg text-white">カードが見つかりません</Text>
        <Pressable
          onPress={() => navigation.navigate('index')}
          className="mt-4 rounded-full bg-purple-600 px-4 py-2">
          <Text className="text-white">トップに戻る</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  // カード画像を取得
  const resolvedImage = imagePaths[card.image];

  return (
    <LinearGradient colors={['#1e293b', '#4338ca']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-4">
          <View className="flex-col items-center gap-6">
            <View className={`aspect-[2/3] w-60 max-w-xs ${isReversed ? 'rotate-180' : ''}`}>
              {resolvedImage && (
                <Image
                  source={resolvedImage}
                  className="h-full w-full rounded-lg shadow-lg web:aspect-[2/3] web:max-h-fit web:max-w-80"
                  resizeMode="cover"
                />
              )}
            </View>

            <View className="w-full flex-1">
              <Text className="mb-4 text-center text-white">
                <Text className="text-2xl font-bold">{card.name} </Text>
                <Text className="text-xl font-normal">{isReversed ? `逆位置` : `正位置`}</Text>
              </Text>
              <View className="mb-1 w-full rounded-lg bg-white/10 p-5">
                <Text className="mb-2 text-center text-2xl font-bold text-white">カードの意味</Text>
                <Text className="mb-6 text-center text-slate-200">{card.meaning}</Text>
                <Text className="mb-2 text-center text-2xl font-bold text-white">詳細な解釈</Text>
                <View className="w-full">
                  <View key={`tarot-message-${renderKey}`}>
                    {error ? (
                      <View>
                        <Text className="mb-2 text-red-400">エラーが発生しました</Text>
                        <Text className="text-red-200">{error}</Text>
                      </View>
                    ) : (
                      <View style={{ padding: 4 }}>
                        {tarotMessage ? (
                          <Text className="text-lg leading-6 text-white" selectable={true}>
                            {isReversed
                              ? tarotMessage.reversed || '逆位置の解釈を取得できませんでした'
                              : tarotMessage.upright || '正位置の解釈を取得できませんでした'}
                          </Text>
                        ) : (
                          <Text className="text-white">生成中...</Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <Pressable
              onPress={() =>
                router.replace({
                  pathname: '/reading/[id]',
                  params: {
                    id: card.id,
                    reversed: reversed,
                    back: 'true',
                  },
                })
              }
              className="relative mb-4 w-full flex-row items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-2">
              <ChevronLeftIcon color="white" size={24} className="absolute" />
              <Text className="w-full pr-8 text-center text-xl text-white">戻る</Text>
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
