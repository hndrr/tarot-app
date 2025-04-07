import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/useColorScheme';

import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // この useEffect は初回マウント時にのみ実行される
    console.log('RootLayout effect runs ONCE.');
    // loaded が true になった時点で SplashScreen を隠す処理は
    // この useEffect の外、または loaded を監視する別の useEffect で行う
    return () => {
      console.log('RootLayout cleanup runs ONCE'); // アンマウント時にログ出力
    };
  }, []); // 依存配列を空にして、初回マウント時のみ実行

  // loaded 状態が true になったら SplashScreen を隠す
  // このチェックはレンダリングごとに行われる
  useEffect(() => {
    if (loaded) {
      console.log('Hiding SplashScreen because loaded is true');
      SplashScreen.hideAsync();
    }
  }, [loaded]); // loaded の変化を監視

  if (!loaded) {
    console.log('RootLayout rendering null (waiting for fonts)');
    return null; // フォントロード中は何も表示しない
  }
  // フォントがロードされたら、メインコンテンツをレンダリング
  console.log('RootLayout rendering main content');

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <SafeAreaView
          className="flex-1"
          style={{
            backgroundColor:
              colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background,
          }}>
          <Stack
            screenOptions={{
              headerShown: false, // 全ての画面でヘッダーを隠す
            }}
            initialRouteName="index">
            <Stack.Screen name="index" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
