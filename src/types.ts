// タロットカードの型定義
export type Card = {
  id: number;
  name: string;
  position: string;
  isReversed: boolean;
};

// タロットカードレスポンスの型定義
export type TarotResponse = {
  upright: string;
  reversed: string;
};

// セッションデータの型定義
export type SessionData = {
  cards: Card[];
  hasVisited: boolean;
};

// セッションAPIリクエストの型定義
export type SessionRequest = {
  card?: Card;
  hasVisited?: boolean;
};
