import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DrawCardButton from '../components/DrawCardButton';

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

      <View className="mb-8 h-96 w-96 overflow-hidden rounded-lg">
        <Image
          source={require('../assets/images/cover.png')}
          resizeMode="cover"
          className="h-full w-full"
        />
      </View>

      <Text className="mb-8 text-xl text-purple-100">今日のあなたの運勢は...?</Text>

      <DrawCardButton />
    </LinearGradient>
  );
}
