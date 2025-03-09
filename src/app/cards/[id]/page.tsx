import { tarotCards } from "@/data/tarotCards";
import { tarotAPI } from "@/lib/client";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import { TarotResponse } from "@/types";
import { cookies } from "next/headers";

type Params = Promise<{ id: string }>;

export const dynamic = "force-dynamic"; // キャッシュを無効化
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function CardDetail({ params }: { params: Params }) {
  console.log("=== CardDetail Component Started ===");
  const { id } = await params;
  console.log("Received ID:", id);

  const card = tarotCards.find((card) => card.id === parseInt(id));
  console.log("Found card:", card);

  // セッションからカード情報を取得
  const cookieStore = await cookies();
  const sessionStr = cookieStore?.get("tarot-cards")?.value;
  console.log("Session string from cookie (cards/[id]):", sessionStr);

  const sessionData = sessionStr
    ? JSON.parse(sessionStr)
    : { card: null, hasVisited: false };

  console.log("Parsed session data (cards/[id]):", JSON.stringify(sessionData));

  // 保存されたカードを取得
  const savedCard =
    sessionData.card?.id === parseInt(id) ? sessionData.card : null;

  console.log("=== Starting Tarot Message Check ===");
  console.log("savedCard:", JSON.stringify(savedCard));
  console.log("savedCard?.tarotMessage:", savedCard?.tarotMessage);

  // デバッグ: savedCardの詳細情報を出力
  if (savedCard) {
    console.log("savedCard full data:", JSON.stringify(savedCard));
    console.log("savedCard.isReversed:", savedCard.isReversed);
    console.log("typeof savedCard.isReversed:", typeof savedCard.isReversed);
    console.log("savedCard.position:", savedCard.position);
  }

  // 逆位置判定を単純化
  const isReversed = Boolean(savedCard?.isReversed);

  console.log("Final isReversed value:", isReversed);
  console.log("typeof isReversed:", typeof isReversed);

  // タロットメッセージをセッションから取得
  let result: TarotResponse | null = null;

  if (savedCard?.tarotMessage) {
    console.log("Using existing tarot message from session");
    result = savedCard.tarotMessage;
  } else {
    console.log("No saved tarot message found, attempting API call");
    if (card) {
      try {
        console.log("=== Starting API Call ===");
        console.log("Card data for API:", {
          name: card.name,
          meaning: card.meaning,
        });

        const response = await tarotAPI.tarot.$post({
          json: {
            name: card.name,
            meaning: card.meaning,
          },
        });

        console.log("API call completed, status:", response.status);

        if (!response.ok) {
          console.error("API Error Status:", response.status);
          const errorText = await response.text();
          console.error("API Error Text:", errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        console.log("API Response Data:", JSON.stringify(responseData));

        if (!responseData.upright || !responseData.reversed) {
          console.error("Invalid response format:", responseData);
          throw new Error("Invalid response format");
        }

        result = responseData;
        console.log("Successfully set result:", JSON.stringify(result));
      } catch (error) {
        console.error("タロット解釈の取得に失敗:", error);
        console.error(
          "Error stack:",
          error instanceof Error ? error.stack : "No stack trace"
        );
      }
    } else {
      console.log("No card data available for API call");
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
