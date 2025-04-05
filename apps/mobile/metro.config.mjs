// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from "expo/metro-config";
import { withNativeWind } from "nativewind/metro";

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// NativeWindの設定を追加
export default withNativeWind(config, {
  input: "./src/global.css",
});
