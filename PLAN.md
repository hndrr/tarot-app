# Web APIをモバイルアプリから利用するための段階的実装計画

## 目的

Webアプリケーション (`apps/web`) で提供されている `/api/tarot` エンドポイントを、モバイルアプリケーション (`apps/mobile`) からも安全かつ安定して利用できるようにする。

## 段階的実装計画

### フェーズ1：基本連携プロトタイプの作成

**目的：** モバイルアプリからWeb APIを呼び出し、基本的なデータ連携が機能することを確認する。

1.  **Web側：シンプルなCORS設定**
    *   `apps/web/src/middleware.ts` に、開発環境（例：`http://localhost:8081`, `exp://...`）からのリクエストを許可する基本的なCORS設定を追加します。
2.  **共通パッケージ：基本的なAPI呼び出し関数**
    *   `packages/tarot-logic/src/generateTarotMessageFromWebApi.ts` に、APIキーやレート制限なしでWeb API (`/api/tarot`) を呼び出す基本的な関数を実装します。
    *   `packages/tarot-logic/src/index.ts` で新しい関数をエクスポートします。
3.  **モバイル側：基本実装**
    *   `apps/mobile/app.json` の `extra` に開発用のWeb API URL (`http://localhost:3000/api`) を設定します。
    *   `apps/mobile/src/app/details/[id].tsx` で、新しく実装した `generateTarotMessageFromWebApi` 関数を使用するように修正します。
    *   必要なパッケージ依存関係 (`@tarrot/tarot-logic`, `axios`, `expo-constants`) を `apps/mobile/package.json` と `packages/tarot-logic/package.json` に追加・更新します。
4.  **動作確認**
    *   Webサーバーとモバイルアプリを開発環境で同時に起動し、モバイルアプリの詳細画面でWeb API経由でタロットメッセージが正しく表示されることを確認します。

### フェーズ2：セキュリティ機能と堅牢性の向上

**目的：** APIのセキュリティを強化し、エラーハンドリングやフォールバックを追加して、より安定した動作を実現する。

1.  **Web側：CORS設定の強化**
    *   `apps/web/src/middleware.ts` のCORS設定を更新し、本番環境のオリジン（例：`capacitor://localhost`, `ionic://localhost`）も許可するようにします。
2.  **Web側：APIキー認証の実装**
    *   APIキー認証ミドルウェア (`apiKeyAuth.ts`) を作成し、`/api/tarot` ルートに適用します。
    *   許可するAPIキーを環境変数 (`ALLOWED_API_KEYS`) で管理します。
3.  **Web側：レート制限の実装**
    *   レート制限ミドルウェア (`rateLimiter.ts`) を作成し、APIルート全体 (`*`) または特定のルートに適用します。（本番環境ではRedisなどの外部ストア推奨）
4.  **モバイル側：APIキーの設定と送信**
    *   `apps/mobile/app.json` の `extra` にAPIキー (`apiKey`) を設定します（本番用は環境変数推奨）。
    *   `generateTarotMessageFromWebApi` 関数を修正し、リクエストヘッダー (`x-api-key`) にAPIキーを含めるようにします。
5.  **共通パッケージ：エラーハンドリングとフォールバック**
    *   `generateTarotMessageFromWebApi` 関数に、リクエストのタイムアウト設定、詳細なエラーログ、ネットワークエラーやAPIエラー発生時のフォールバック処理（例：ローカルの `generateTarotMessageMobile` を呼び出す）を追加します。
6.  **最終テスト**
    *   開発環境および本番環境（またはステージング環境）で、セキュリティ機能を含めた全体の動作をテストします。レート制限や無効なAPIキーでのアクセスもテストします。