import { tarotCards } from "@/data/tarotCards";
import { delay } from "@/lib/delay";
import TarotCard from "@components/TarotCard";
import SaveCard from "@/components/SaveCard";
import Link from "next/link";
import { cookies } from "next/headers";
import DrawCardButton from "@/components/DrawCardButton";
import { tarotAPI } from "@/lib/client";

// このページをキャッシュしない設定
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = Promise<{ id: string }>;

async function getTarotMessage(
  name: string,
  meaning: string
): Promise<{
  upright: string;
  reversed: string;
} | null> {
  const response = await tarotAPI.tarot.$post({
    json: { name: name, meaning: meaning },
  });

  // if (!response.ok) {
  //   throw new Error("タロットメッセージの取得に失敗しました");
  // }

  return await response.json();
}

export default async function Reading({ params }: { params: Params }) {
  const { id } = await params;
  const card = tarotCards.find((card) => card.id === parseInt(id));
  // セッションからデータを取得
  const cookieStore = await cookies();
  const sessionStr = cookieStore?.get("tarot-cards")?.value;

  const sessionData = sessionStr
    ? JSON.parse(sessionStr)
    : { card: null, hasVisited: false };

  // 既存のカードがあればその状態を使用、なければランダムに決定
  const existingCard =
    sessionData.card?.id === parseInt(id) ? sessionData.card : null;

  // 既存のカードがあればその状態を使用、なければランダムに決定
  // 一度決定した逆位置の状態は保持する
  // 同じIDのカードが存在する場合は、そのisReversed値を使用
  const isReversed = existingCard
    ? Boolean(existingCard.isReversed) // 明示的に真偽値に変換
    : Math.random() < 0.5;

  if (!sessionData.hasVisited) {
    await delay(6000);
  }

  // タロットメッセージを取得
  let tarotMessage = null;

  if (card) {
    try {
      console.log("Fetching new tarot message from API");
      const response = await getTarotMessage(card.name, card.meaning);

      tarotMessage = response;
    } catch (error) {
      console.error("タロットメッセージの取得に失敗:", error);
    }
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center">
        <p>カードが見つかりません</p>
        <Link href="/" className="text-purple-300 hover:text-purple-100 mt-4">
          トップに戻る
        </Link>
      </div>
    );
  }

  // TarotCardコンポーネントに渡すカードデータ
  const tarotCardData = {
    id: card.id,
    name: card.name,
    image: card.image,
    meaning: card.meaning,
  };

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
            <TarotCard card={tarotCardData} isReversed={isReversed} />
            {tarotMessage && (
              <SaveCard
                card={{
                  id: card.id,
                  name: card.name,
                  position: isReversed ? "reversed" : "upright",
                  isReversed: isReversed,
                  tarotMessage: tarotMessage || undefined,
                }}
                isFirstVisit={!sessionData.hasVisited}
                skipSave={false} // 常に保存を試みる（デバッグのため）
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
            <Link
              href="/"
              className="text-purple-300 hover:text-purple-100 transition duration-300"
            >
              トップに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
