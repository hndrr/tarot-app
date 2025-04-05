import React from 'react';
import { View, Text, Image } from 'react-native';

export const TarotLoading = () => {
  return (
    <View className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      {/* background */}
      <View className="absolute inset-0 z-0 overflow-hidden">
        <Image
          source={require('assets/images/mystic-background.jpg')}
          resizeMode="cover"
          className="h-full w-full opacity-70"
        />
      </View>

      {/* star */}
      {/* <View className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, index) => (
          <View
            key={index}
            className="absolute bg-white rounded-full opacity-70 animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></View>
        ))}
      </View> */}

      {/* main */}
      <View className="z-10 flex flex-col items-center">
        <View className="relative mb-4 h-40 w-40">
          <Image
            source={require('assets/images/crystal-ball.png')}
            resizeMode="cover"
            className="h-full w-full object-contain opacity-80"
          />
        </View>

        {/* text */}
        <Text className="ml-6 mt-6 animate-fade rounded-md bg-black bg-opacity-40 px-2 py-1.5 text-2xl font-bold text-amber-200">
          あなたの運命を占っています...
        </Text>
      </View>
    </View>
  );
};
