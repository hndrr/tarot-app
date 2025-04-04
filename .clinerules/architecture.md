# プロジェクト構成図

## 概要

このドキュメントは、Tarrot App (仮称) のシステムアーキテクチャを図示します。
このプロジェクトは pnpm workspaces と Turbo Repo を利用したモノレポ構成を採用しています。

## 主要コンポーネント

- **Web Application:** `apps/web`
  - フレームワーク: Next.js
  - 言語: TypeScript
  - スタイリング: Tailwind CSS
  - 役割: Web ユーザー向けのインターフェースを提供。
- **Mobile Application:** `apps/mobile`
  - フレームワーク: React Native / Expo
  - 言語: TypeScript
  - スタイリング: Tailwind CSS (NativeWind)
  - 役割: iOS/Android ユーザー向けのインターフェースを提供。
- **Shared Packages:** `packages/` - アプリケーション間でコードを共有し、一貫性を保ちます。
  - `packages/ui`: React / React Native 共通の UI コンポーネント (Tailwind CSS ベース)。
  - `packages/tarot-logic`: タロット占いのコアロジック。外部 AI サービス (Cloudflare AI, Gemini 等) を利用して解釈メッセージを生成する機能を含む可能性があります。
  - `packages/constants`: アプリケーション全体で使用する定数 (色、カード情報など)。
  - `packages/types`: 共有 TypeScript 型定義。
  - `packages/utils`: 共通ユーティリティ関数やカスタムフック。
  - `packages/api-schema`: (将来的な) API スキーマ定義。
  - `packages/eslint-config`, `packages/typescript-config`: コード品質と一貫性を保つための共有設定。

## 図

```mermaid
graph TD
    subgraph "User Facing Apps"
        B[apps/web (Next.js)];
        C[apps/mobile (React Native/Expo)];
    end

    subgraph "Shared Packages"
        UI[packages/ui];
        Logic[packages/tarot-logic];
        Const[packages/constants];
        Types[packages/types];
        Utils[packages/utils];
        Schema[packages/api-schema];
        Lint[packages/eslint-config];
        TSConfig[packages/typescript-config];
    end

    subgraph "External Services"
        AI[External AI (Cloudflare/Gemini?)];
    end

    subgraph "Development Tools"
        PNPM[pnpm workspaces];
        Turbo[Turbo Repo];
    end

    User --> B;
    User --> C;

    B --> UI;
    B --> Logic;
    B --> Const;
    B --> Types;
    B --> Utils;

    C --> UI;
    C --> Logic;
    C --> Const;
    C --> Types;
    C --> Utils;

    Logic --> AI;

    B -.-> Lint & TSConfig;
    C -.-> Lint & TSConfig;
    UI -.-> Lint & TSConfig;
    Logic -.-> Lint & TSConfig;
    Const -.-> Lint & TSConfig;
    Types -.-> Lint & TSConfig;
    Utils -.-> Lint & TSConfig;
    Schema -.-> Lint & TSConfig;

    PNPM & Turbo -- Manages --> B & C & UI & Logic & Const & Types & Utils & Schema & Lint & TSConfig;

    style User fill:#f9f,stroke:#333,stroke-width:2px
    style AI fill:#ccf,stroke:#333,stroke-width:2px
    style PNPM fill:#eee,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5
    style Turbo fill:#eee,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5
```

*(上記の Mermaid 記法は構成図の一例です。プロジェクトに合わせて修正してください)*

## データフロー

- **タロット占い実行:**
  1. ユーザーが Web または Mobile アプリでカードを引く操作を行う。
  2. Frontend アプリ (`apps/web` or `apps/mobile`) がリクエストを受け取る。
  3. `packages/tarot-logic` の関数を呼び出し、引いたカード情報を渡す。
  4. `packages/tarot-logic` が必要に応じて外部 AI サービス (Cloudflare/Gemini?) にカード情報と解釈依頼を送信。
  5. 外部 AI サービスが解釈結果を返す。
  6. `packages/tarot-logic` が結果を整形し、Frontend アプリに返す。
  7. Frontend アプリが `packages/ui` のコンポーネントを使って結果を表示する。

## 技術選定理由

- **モノレポ (pnpm workspaces, Turbo Repo):** コード共有の促進、依存関係管理の簡素化、ビルド/テストの高速化。
- **TypeScript:** 静的型付けによる開発効率とコード品質の向上。
- **Next.js (Web):** パフォーマンス、SEO、開発体験に優れた React フレームワーク。
- **React Native / Expo (Mobile):** Web とコードベース (特に UI コンポーネントやロジック) を共有しつつ、ネイティブアプリを開発可能。Expo による開発・ビルドの簡便化。
- **Tailwind CSS:** ユーティリティファーストによる迅速な UI 開発と一貫性の維持。NativeWind により React Native でも利用可能。
- **共有パッケージ (`packages/`):** DRY 原則に基づき、アプリ間のコード重複を削減し、保守性を向上。
- **外部 AI サービス:** 高度な自然言語処理能力を活用し、人間味のあるタロット解釈を提供するため (推測)。