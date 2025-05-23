import { tarotCards } from "@repo/constants";
import { getSessionCards } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // remark-gfmをインポート

// Define props for the wrapper, matching ReactMarkdown's options if needed
// For basic usage, just accepting children might be enough
type MarkdownWrapperProps = {
  children: string;
};

type Params = Promise<{ id: string }>;

type TarotResponse = {
  upright: string;
  reversed: string;
};

const MarkdownWrapper: FC<MarkdownWrapperProps> = ({ children, ...props }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} {...props}>
      {children}
    </ReactMarkdown>
  );
};

async function getTarotMessage(
  name: string,
  meaning: string
): Promise<TarotResponse> {
  const apiHost = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  console.log("Requesting API:", `${apiHost}/api/tarot`);

  const res = await fetch(`${apiHost}/api/tarot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // ALLOWED_API_KEYSに設定された単一のキーを使用する
      "x-api-key": process.env.ALLOWED_API_KEYS || "",
    },
    body: JSON.stringify({ name, meaning }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error:", {
      status: res.status,
      statusText: res.statusText,
      body: errorText,
    });
    throw new Error(
      `文言生成に失敗しました。Status: ${res.status}, Body: ${errorText}`
    );
  }

  return res.json();
}

export default async function CardDetail({ params }: { params: Params }) {
  const { id } = await params;
  const card = tarotCards.find((card) => card.id === parseInt(id));

  // セッションからカード情報を取得
  const savedCards = await getSessionCards();
  const savedCard = savedCards.find((c) => c.id === parseInt(id));
  console.log("savedCard", savedCard);
  const isReversed = savedCard?.isReversed ?? false;

  let result: TarotResponse | null = null;

  if (card) {
    try {
      result = await getTarotMessage(card.name, card.meaning);
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
        <Link
          href={`/reading/${id}`}
          className="inline-block mb-8 text-purple-300 hover:text-purple-100 transition duration-300"
        >
          戻る
        </Link>

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
                <div className="text-gray-200 whitespace-pre-wrap">
                  <MarkdownWrapper>
                    {isReversed
                      ? result?.reversed || "解釈を取得できませんでした。" // resultがnullの場合のフォールバック
                      : result?.upright || "解釈を取得できませんでした。"}
                  </MarkdownWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
