# Monorepo 化計画 (pnpm + Turborepo + Next.js + Expo)

**方針:** 既存の Next.js プロジェクト (`tarrot_app`) と既存の Expo プロジェクト (`/Users/hndr/workspace/tarrot-app-expo`) を monorepo 化し、最大限のコード共有を目指す。

## 計画ステップ

1.  **pnpm の導入とワークスペース設定:**
    *   プロジェクトルート (`/Users/hndr/workspace/tarrot_app`) に `pnpm-workspace.yaml` を作成し、`apps/*` と `packages/*` をワークスペースとして定義します。
    *   既存の `package-lock.json` を削除し、`pnpm install` を実行して `pnpm-lock.yaml` を生成します。
2.  **Turborepo の導入:**
    *   `pnpm add -D -w turbo` を実行して Turborepo を開発依存として追加します。
    *   ルートに `turbo.json` を作成し、基本的なパイプライン（例: `dev`, `build`, `lint`, `type-check`）を設定します。
3.  **ディレクトリ構造の作成:**
    *   `apps` ディレクトリを作成し、その中に `web` と `mobile` ディレクトリを作成します。
    *   `packages` ディレクトリを作成し、以下の共有パッケージを作成します（必要に応じて追加・変更）。
        *   `packages/types`: 共有する TypeScript の型定義。
        *   `packages/api-schema`: Zod などを用いた API スキーマ定義。
        *   `packages/utils`: 共通のユーティリティ関数。
        *   `packages/ui`: 共通の UI コンポーネント（**注意:** React Native と Web の差異があるため、慎重なアプローチが必要）。
        *   `packages/api-client`: 共通の API 通信ロジック（必要であれば）。
        *   `packages/auth`: 共通の認証ロジック（必要であれば）。
4.  **既存 Next.js アプリの移動:**
    *   現在のプロジェクト (`tarrot_app`) のファイル（`src`, `public`, `next.config.ts`, `tsconfig.json`, `postcss.config.js`, `tailwind.config.ts`, `eslint.config.mjs` など）を `apps/web` ディレクトリに移動します。
    *   ルートの `package.json` の内容を `apps/web/package.json` に移動し、Next.js アプリ固有の設定を定義します。
5.  **既存 Expo アプリの移動:**
    *   `/Users/hndr/workspace/tarrot-app-expo` の内容を `apps/mobile` ディレクトリに移動します。
    *   Expo プロジェクト固有の設定（`app.json` や `expo` フィールドを含む `package.json` など）もそのまま移動します。
6.  **共有パッケージの初期設定:**
    *   `packages/*` ディレクトリそれぞれに、`package.json` と `tsconfig.json` を作成します。`tsconfig.json` はルートに作成する `tsconfig.base.json` を継承するように設定します。
    *   `packages/ui` は React Native (`react-native`) と `react-native-web` を前提とした設定を行います。
7.  **共有コードの抽出と移動:**
    *   **Types/API Schema/Utils:** 両プロジェクトから共通部分を特定し、対応する `packages/*` に移動・集約します。
    *   **UI コンポーネント:** NativeWind/Tailwind CSS の設定共通化から始め、`react-native-web` を活用して段階的にコンポーネント共通化を進めます。完全な共通化が難しい場合がある点に留意します。
    *   **API Client/Auth:** 必要に応じて関連ロジックを抽出し、対応する `packages/*` に移動します。
8.  **依存関係の整理:**
    *   `apps/web/package.json` と `apps/mobile/package.json` を更新し、作成した共有パッケージ (`packages/*`) をワークスペースプロトコル (`workspace:*`) で依存関係に追加します。
    *   各アプリから共有パッケージに移した依存関係を削除します。
    *   共通の開発依存（TypeScript, ESLint, Prettier, Turborepo, TailwindCSS など）はルートの `package.json` に集約します。
9.  **設定ファイルの調整:**
    *   ルートに共通の TypeScript 設定 `tsconfig.base.json` を作成します。
    *   ルートの ESLint 設定 (`eslint.config.mjs`) を monorepo 構成に合わせて調整します。
    *   Tailwind CSS / NativeWind の設定を `packages/ui` などに共通設定として置き、各アプリから参照・拡張する形を検討します。
10. **Turborepo パイプラインの最適化:**
    *   `turbo.json` のパイプライン設定を詳細化し、パッケージ間の依存関係を定義して、ビルドやテスト、リンターの実行順序とキャッシュを最適化します。

## ディレクトリ構成（イメージ）

```mermaid
graph TD
    subgraph Monorepo Root (tarrot_app)
        direction LR
        A[package.json]
        B[pnpm-workspace.yaml]
        C[turbo.json]
        D[tsconfig.base.json]
        E[eslint.config.mjs]
        F[apps/]
        G[packages/]
    end

    subgraph apps
        direction TB
        H[web/] --> I{Next.js App (Existing moved)}
        J[mobile/] --> K{Expo App (Existing moved from /Users/hndr/workspace/tarrot-app-expo)}
    end

    subgraph packages
        direction TB
        L[types/] --> M{Shared Types}
        N[api-schema/] --> O{Shared API Schema (Zod)}
        P[utils/] --> Q{Shared Utilities}
        R[ui/] --> S{Shared UI Components (RN/RNW based - Careful Approach)}
        T[api-client/] --> U{Shared API Client (Optional)}
        V[auth/] --> W{Shared Auth Logic (Optional)}
        X[...] --> Y{Other shared packages as needed}
    end

    F --> H
    F --> J
    G --> L
    G --> N
    G --> P
    G --> R
    G --> T
    G --> V
    G --> X

    I -- depends on --> L
    I -- depends on --> N
    I -- depends on --> P
    I -- depends on --> R
    I -- depends on --> T
    I -- depends on --> V
    I -- depends on --> X

    K -- depends on --> L
    K -- depends on --> N
    K -- depends on --> P
    K -- depends on --> R
    K -- depends on --> T
    K -- depends on --> V
    K -- depends on --> X