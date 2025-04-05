# コーディング規約

## 概要

このドキュメントは、**Tarrot App (仮称)** プロジェクトにおける TypeScript, React (Next.js), React Native (Expo) のコーディングスタイルと規約を定義します。
一貫性のあるコードベースを維持し、可読性と保守性を向上させることを目的としています。コードは **Prettier** と **ESLint** によって自動的にフォーマット・チェックされるため、これらのツールの設定に従うことが基本となります。

## フォーマット (Prettier + ESLint)

コードのフォーマットは **Prettier** によって自動的に行われます。開発者は Prettier の設定 ([`.prettierrc` や `package.json` 内の設定を確認]) に従う必要があります。手動でのフォーマット調整は原則として行いません。

- **インデント:** スペース 2 つ (Prettier 設定)
- **セミコロン:** 付与する (Prettier 設定)
- **引用符:** シングルクォート (`'`) を使用 (Prettier 設定)
- **行末の空白:** Prettier が自動削除
- **ファイルの末尾:** Prettier が空行を 1 行挿入

ESLint はコードの品質や潜在的な問題をチェックしますが、フォーマットに関するルールは Prettier に委譲します (`eslint-config-prettier` を使用)。

## 命名規則 (TypeScript / React)

- **変数・関数:** `camelCase` (例: `userName`, `getUserData`)
- **型・インターフェース・クラス・Enum:** `PascalCase` (例: `UserProfile`, `LoadingState`)
- **React コンポーネント:** `PascalCase` (ファイル名も同様、例: `UserProfileCard.tsx`)
- **React Hooks:** `use` プレフィックス + `camelCase` (例: `useUserData`)
- **定数 (再代入不可な値):**
    - 基本的に `camelCase` (export しない場合)
    - グローバルな定数や Enum の代替として `as const` を使う場合は `UPPER_SNAKE_CASE` も可 (例: `export const MAX_RETRIES = 3;`)
- **プライベート変数/メソッド (クラス内):** `#` プレフィックス (ECMAScript private fields) または `_` プレフィックス (慣習) を使用。プロジェクト内で統一する。

## コメント

- 複雑なロジックや意図が明確でない箇所にはコメントを追加する。
- TODO コメントは、将来対応が必要な箇所を示すために使用する。 (例: `// TODO: エラーハンドリングを改善する`)

## Linting と Formatting (ESLint + Prettier)

- **リンター:** **ESLint** を使用します。設定はルートの `eslint.config.mjs` および各パッケージの ESLint 設定に基づきます。
- **フォーマッター:** **Prettier** を使用します。設定はルートの Prettier 設定ファイル ([`.prettierrc` や `package.json` を確認]) に従います。
- **実行:**
    - `pnpm lint`: プロジェクト全体の Lint チェックを実行します。
    - `pnpm format`: プロジェクト全体のコードフォーマットを実行します。
- **推奨:** VS Code などのエディタ拡張機能を導入し、保存時に自動でフォーマット・Lint修正が実行されるように設定してください。
- **CI:** CI 環境でも Lint チェックとフォーマット検証が実行されます。マージ前にこれらのチェックをパスしている必要があります。

## TypeScript

- **型注釈:** 変数、関数の引数、戻り値には可能な限り型注釈を付与します。型推論が明確な場合は省略可能です。
- **`any` の禁止:** `any` 型の使用は原則禁止します。どうしても必要な場合は理由をコメントで明記し、より具体的な型 (`unknown` や Generics) が使えないか検討してください。
- **`interface` vs `type`:**
    - オブジェクトの形状を定義する場合: `interface` を優先します (宣言のマージが可能)。
    - Union 型、Intersection 型、Tuple 型、プリミティブ型のエイリアスなど: `type` を使用します。
- **Enum:** 数値 Enum は避け、文字列 Enum または Union Types + `as const` を使用します。
    ```typescript
    // OK
    type Status = 'idle' | 'loading' | 'success' | 'error';
    const STATUS = {
      IDLE: 'idle',
      LOADING: 'loading',
      SUCCESS: 'success',
      ERROR: 'error',
    } as const;
    type StatusValue = typeof STATUS[keyof typeof STATUS];

    // NG (場合によるが、基本避ける)
    enum NumericStatus { Idle, Loading, Success, Error }
    ```
- **Non-null Assertion Operator (`!`):** 使用を避け、型ガードや Optional Chaining (`?.`)、Nullish Coalescing (`??`) を使用してください。

## React / React Native

- **関数コンポーネント:** クラスコンポーネントではなく、関数コンポーネントと Hooks を使用します。
- **Props の型付け:** コンポーネントの Props は必ず TypeScript の `interface` または `type` で定義します。
- **状態管理:**
    - コンポーネントローカルな状態: `useState`, `useReducer` を使用します。
    - グローバルな状態共有: Context API や状態管理ライブラリ (例: Zustand, Jotai - プロジェクトで採用されているものを明記) を使用します。Props drilling は避けてください。
- **副作用:** `useEffect` を使用します。依存配列を正しく設定し、不要な再実行を防いでください。クリーンアップ関数が必要な場合は必ず実装してください。
- **メモ化:** パフォーマンスが問題になる場合に `useMemo`, `useCallback`, `React.memo` を適切に使用します。過度な最適化は避けてください。

## Imports

- **順序:** ESLint の `import/order` ルールに従い、以下の順序でグループ化し、各グループ間には空行を入れます。
    1. React / React Native 関連
    2. 外部ライブラリ (npm パッケージ)
    3. 内部パッケージ (`packages/*`)
    4. 絶対パスによる内部モジュール (`@/components/*` など)
    5. 相対パスによる内部モジュール (`../`, `./`)
    6. 型インポート (`import type ...`)
- **エイリアス:** `tsconfig.base.json` で設定されたパスエイリアス (`@/*`) を積極的に利用します。

## Tailwind CSS / NativeWind

- **ユーティリティファースト:** 基本的にユーティリティクラスを直接 HTML/JSX 要素に適用します。
- **コンポーネント化:** 繰り返し使用されるスタイルや複雑なスタイルを持つ要素は、UI コンポーネントとして抽出します (`packages/ui` を活用)。
- **`@apply` の使用:** 乱用を避け、限定的なケース（例: 複数の要素で全く同じ複雑なスタイルセットを共有する場合）に留めます。基本的にはコンポーネント化を優先します。
- **カスタムクラス:** プロジェクト固有のデザインシステムに基づいて `tailwind.config.js` で定義されたカスタムクラスを利用します。

## その他

- **`console.log` の削除:** デバッグ目的で使用した `console.log` は、コードをコミットする前に削除してください。必要なログ出力は、適切なロギングライブラリや機構を使用します。
- **コメントアウトされたコード:** 不要になったコードはコメントアウトせず、削除してください。バージョン管理システム (Git) で履歴を追跡できます。
- **エラーハンドリング:** 適切なエラーハンドリングを行い、ユーザーに分かりやすいフィードバックを提供してください。Promise を扱う際は `.catch()` や `try...catch` を忘れないでください。