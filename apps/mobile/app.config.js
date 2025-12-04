// apps/mobile/app.config.js
require('dotenv').config();

// 元の app.json の内容をベースにした設定
const baseConfig = {
  name: 'TAROTIE',
  slug: 'tarrot-app-expo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true, // newArchEnabled を復活
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.hndr.tarrotappexpo',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/images/icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.hndr.tarrotappexpo',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './src/assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './src/assets/images/icon.png',
        imageWidth: 200,
        resizeMode: 'cover',
        backgroundColor: '#4338ca',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          minSdkVersion: 24,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    webApiUrl: {
      development: process.env.EXPO_PUBLIC_WEB_API_URL_DEVELOPMENT || '',
      production: process.env.EXPO_PUBLIC_WEB_API_URL_PRODUCTION || '',
    },
    router: {
      origin: false,
    },
    eas: {
      projectId: process.env.EAS_PROJECT_ID || '',
    },
  },
};

export default ({ config }) => {
  // EAS Build から渡される設定と元の設定をマージ
  return {
    ...config,
    ...baseConfig,
  };
};
