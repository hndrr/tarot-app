import { tarotCards } from "@/data/tarotCards";
import { delay } from "@/lib/delay";
import { Card } from "@/lib/actions";
import TarotCard from "@components/TarotCard";
import SaveCard from "@/components/SaveCard";
import Link from "next/link";
import DrawCardButton from "@/components/DrawCardButton";
import { client } from "@/lib/client";
import { SessionData } from "@/app/api/api-schema";
import { BackButton } from "@/components/BackButton";

type Params = Promise<{ id: string }>;

export default async function Reading({ params }: { params: Params }) {
  const { id } = await params;
  const card = tarotCards.find((card) => card.id === parseInt(id));

  // Honoクライアントを使用してセッションデータを取得
  const response = await client.api.session.$get();
  const data = await response.json();
  const sessionData: SessionData =
    "error" in data ? { cards: [], hasVisited: false } : data;

  // 既存のカードがあればその状態を使用、なければランダムに決定
  const existingCard = sessionData.cards?.find(
    (c: Card) => c.id === parseInt(id)
  );
  const isReversed = existingCard
    ? existingCard.isReversed
    : Math.random() < 0.5;

  if (!sessionData.hasVisited) {
    await delay(6000);
  }

  const cardData = card
    ? {
        id: card.id,
        name: card.name,
        position: isReversed ? "reversed" : "upright",
        isReversed,
      }
    : null;

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center">
        <p>カードが見つかりません</p>
        <BackButton label="トップに戻る" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">あなたのカード</h1>
          <p className="text-purple-200">
            このカードがあなたに伝えるメッセージ
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-2xl w-full">
            <TarotCard card={card} isReversed={isReversed} />
            {cardData && (
              <SaveCard
                card={cardData}
                isFirstVisit={!sessionData.hasVisited}
              />
            )}
            <div className="mt-8 text-center">
              <Link
                href={`/cards/${card.id}`}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 inline-block"
              >
                詳細を見る
              </Link>
            </div>
          </div>

          <div className="flex gap-8 flex-col text-center">
            <DrawCardButton variant="secondary" label="もう一度引く" />
            <BackButton label="トップに戻る" />
          </div>
        </div>
      </div>
    </div>
  );
}
