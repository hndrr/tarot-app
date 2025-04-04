import React from "react";
import { View, Text, Image } from "react-native";

export const TarotLoading = () => {
  return (
    <View className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* background */}
      <View className="absolute inset-0 z-0">
        <Image
          source={require("assets/images/mystic-background.jpg")}
          resizeMode="cover"
          className="object-cover opacity-70 w-full h-full"
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
      <View className="flex flex-col items-center z-10">
        <View className="relative w-40 h-40 mb-4">
          <Image
            source={require("assets/images/crystal-ball.png")}
            resizeMode="cover"
            className="object-contain opacity-80 w-full h-full"
          />
        </View>

        {/* text */}
        <Text className="ml-6 mt-6 text-amber-200 text-2xl animate-fade font-bold bg-black bg-opacity-40 px-2 py-1.5 rounded-md">
          あなたの運命を占っています...
        </Text>
      </View>
    </View>
  );
};
