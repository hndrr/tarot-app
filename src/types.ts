// タロットカードの型定義
export type Card = {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
  tarotMessage?: TarotResponse;
};

// タロットカードレスポンスの型定義
export type TarotResponse = {
  upright: string;
  reversed: string;
};

// セッションデータの型定義
export type SessionData = {
  card: Card | null;
  hasVisited: boolean;
};

// セッションAPIリクエストの型定義
export type SessionRequest = {
  card?: Card | null;
  hasVisited?: boolean;
  tarotMessage?: {
    cardId: number;
    message: TarotResponse;
  };
};
