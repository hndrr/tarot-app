interface TarotResponse {
  upright: string;
  reversed: string;
}

export const generateTarotMessage = async (name: string, meaning: string) => {
  // APIキーがないため、ダミーのレスポンスを返す
  const dummyResponse: TarotResponse = {
    upright: `${name}のカードは、${meaning}を表しています。現在のあなたは、新しい可能性に恵まれています。自分の直感を信じて、前に進むことで良い結果が得られるでしょう。`,
    reversed: `逆位置の${name}は、${meaning}の反対の意味を持ちます。今のあなたは少し立ち止まって、自分の行動や考えを見直す必要があるかもしれません。焦らずに、じっくりと状況を分析してみましょう。`,
  };

  return dummyResponse;
};
