import { tarotCards } from "@/data/tarotCards";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import { cookies } from "next/headers";
import { tarotAPI } from "@/lib/client";

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

  if (!response.ok) {
    throw new Error("タロットメッセージの取得に失敗しました");
  }

  return await response.json();
}

export default async function CardDetail({ params }: { params: Params }) {
  const { id } = await params;
  const card = tarotCards.find((card) => card.id === parseInt(id));

  // セッションからカード情報を取得
  const cookieStore = await cookies();
  const sessionStr = cookieStore?.get("tarot-cards")?.value;
  const sessionData = sessionStr
    ? JSON.parse(sessionStr)
    : { card: null, hasVisited: false };

  console.log("Session Data:", JSON.stringify(sessionData, null, 2));

  // 保存されたカードを取得
  const savedCard =
    sessionData.card?.id === parseInt(id) ? sessionData.card : null;

  console.log("Saved Card:", JSON.stringify(savedCard, null, 2));

  // 逆位置判定を単純化
  const isReversed = Boolean(savedCard?.isReversed);

  let result = null;

  if (card) {
    try {
      result = await getTarotMessage(card.name, card.meaning);
    } catch (error) {
      console.error("エラー:", error);
    }
  }

  // // タロットメッセージをセッションから取得
  // const result = savedCard?.tarotMessage || null;

  console.log("Tarot Message:", JSON.stringify(result, null, 2));
  console.log("Is Reversed:", isReversed);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <BackButton id={id} />

        <div className="flex flex-col md:flex-row items-center gap-10">
          <div
            className={`relative aspect-[2/3] w-64 ${
              isReversed && "rotate-180"
            }`}
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              className="rounded-lg object-cover"
              priority
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">
              {card.name}
              <span className="ml-2 text-2xl font-normal">
                {isReversed ? `逆位置` : `正位置`}
              </span>
            </h1>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">カードの意味</h2>
              <p className="text-gray-200">{card.meaning}</p>
              <h2 className="text-xl font-semibold mt-6 mb-2">詳細な解釈</h2>
              <div className="space-y-4">
                <p className="text-gray-200">
                  {isReversed ? result?.reversed : result?.upright}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
