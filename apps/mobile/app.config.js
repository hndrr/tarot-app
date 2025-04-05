// apps/mobile/app.config.js
require('dotenv').config(); // .env ファイルを読み込む

export default ({ config }) => {
  // 環境変数から値を取得 (フォールバック値なし)
  // これらの環境変数はビルド時または実行時に設定されている必要がある
  const WEB_API_URL_DEV = process.env.EXPO_PUBLIC_WEB_API_URL_DEVELOPMENT;
  const WEB_API_URL_PROD = process.env.EXPO_PUBLIC_WEB_API_URL_PRODUCTION;
  const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID;

  // 環境変数が設定されていない場合のチェック (任意)
  if (!WEB_API_URL_DEV) {
    console.warn('⚠️ EXPO_PUBLIC_WEB_API_URL_DEVELOPMENT is not set in environment variables.');
  }
  if (!WEB_API_URL_PROD) {
    console.warn('⚠️ EXPO_PUBLIC_WEB_API_URL_PRODUCTION is not set in environment variables.');
  }
  if (!EAS_PROJECT_ID) {
    console.warn('⚠️ EAS_PROJECT_ID is not set in environment variables.');
  }

  return {
    // ...config, // expo-cli や EAS Build から渡されるデフォルト設定を含める場合があるためコメントアウトしておく
    expo: {
      name: 'TAROTIE',
      slug: 'tarrot-app-expo',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './src/assets/images/icon.png',
      scheme: 'myapp',
      userInterfaceStyle: 'automatic',
      // newArchEnabled: true, // 元の app.json にあったが、config に含まれる可能性もあるためコメントアウト
      ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.hndr.tarrotappexpo', // 固定値
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './src/assets/images/icon.png',
          backgroundColor: '#ffffff',
        },
        package: 'com.hndr.tarrotappexpo', // 固定値
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
      ],
      experiments: {
        typedRoutes: true,
      },
      extra: {
        // 環境変数から読み込んだ値を使用 (undefined の可能性あり)
        webApiUrl: {
          development: WEB_API_URL_DEV,
          production: WEB_API_URL_PROD,
        },
        router: {
          origin: false, // 元の設定を維持
        },
        eas: {
          projectId: EAS_PROJECT_ID, // 環境変数から取得 (undefined の可能性あり)
        },
      },
    },
  };
};
