import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DrawCardButton from '../components/DrawCardButton';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <LinearGradient
      colors={['#1e293b', '#4338ca']} // スレート900からインディゴ900に対応
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}>
      <Text className="mb-8 text-3xl font-bold text-white">タロット占い</Text>

      <View className="mb-8 aspect-square h-96 w-96 overflow-hidden rounded-lg">
        <Image
          source={require('../assets/images/cover.png')}
          resizeMode="cover"
          className="aspect-square max-h-fit max-w-96"
        />
      </View>

      <Text className="mb-8 text-xl text-purple-100">今日のあなたの運勢は...?</Text>

      <DrawCardButton />

      <View className="mt-4 w-full items-center justify-center pb-4">
        <View className="flex w-4/5 max-w-3xl flex-col items-center gap-2">
          <Link href="https://tarotie.hndr.dev/privacy" className="text-blue-300 underline">
            <Text className="text-white">プライバシーポリシー</Text>
          </Link>
          <Text className="text-white">© 2025 Tarotie</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
