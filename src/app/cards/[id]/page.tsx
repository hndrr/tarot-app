import { tarotCards } from "@/data/tarotCards";
import { tarotAPI } from "@/lib/client";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import { TarotResponse } from "@/types";
import { cookies } from "next/headers";

type Params = Promise<{ id: string }>;

export default async function CardDetail({ params }: { params: Params }) {
  const { id } = await params;
  const card = tarotCards.find((card) => card.id === parseInt(id));

  // セッションからカード情報を取得
  const cookieStore = await cookies();
  const sessionStr = cookieStore?.get("tarot-cards")?.value;
  console.log("Session string from cookie (cards/[id]):", sessionStr); // デバッグ用

  const sessionData = sessionStr
    ? JSON.parse(sessionStr)
    : { cards: [], hasVisited: false };

  console.log("Parsed session data (cards/[id]):", JSON.stringify(sessionData)); // デバッグ用

  const savedCard = sessionData.cards?.find(
    (c: { id: number }) => c.id === parseInt(id)
  );

  console.log(
    "Saved card (cards/[id]):",
    savedCard ? JSON.stringify(savedCard) : "not found"
  ); // デバッグ用

  // セッションに保存されたカードがあればその逆位置の状態を使用、なければデフォルトで正位置
  // position プロパティも確認する
  const isReversed =
    savedCard?.isReversed ?? savedCard?.position === "reversed" ?? false;

  console.log("Is reversed (cards/[id]):", isReversed); // デバッグ用

  // タロットメッセージをセッションから取得
  let result: TarotResponse | null = null;
  if (savedCard?.tarotMessage) {
    result = savedCard.tarotMessage;
  } else if (card) {
    // セッションにタロットメッセージがない場合は、APIから取得（フォールバック）
    try {
      const response = await tarotAPI.api.tarot.$post({
        json: {
          name: card.name,
          meaning: card.meaning,
        },
      });

      if (!response.ok) {
        throw new Error("文言生成に失敗しました。");
      }

      result = await response.json();
    } catch (error) {
      console.error("エラー:", error);
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
