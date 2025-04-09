"use client";

import { DrawCardButton } from "@/components/DrawCardButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNarrationFlow } from "@/hooks/useNarrationFlow";
// useState, inputText, setInputText は不要

export default function FortunePage() {
  const { displayedText, state, start } = useNarrationFlow();
  // const isMounted = useRef(false); // isMounted を削除 (またはコメントアウト)

  // useEffect(() => { // 自動開始をコメントアウト
  //   // 初回訪問時、かつまだ実行されていない場合のみナレーションを開始
  //   if (state === "idle" && !isMounted.current) {
  //     start("恋愛");
  //     isMounted.current = true; // 実行済みフラグを立てる
  //   }
  // }, [start, state]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-black text-white p-8">
      {state === "idle" && (
        <h1 className="text-3xl font-bold mb-8">何を占いますか？</h1>
      )}
      {state === "idle" && (
        <div className="grid grid-cols-2 gap-4 my-8 w-full max-w-md">
          <button
            className="px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg break-keep"
            onClick={() => start("今日の運勢を占う前口上を話してください")}
          >
            ☀️ 今日の運勢
          </button>
          <button
            className="px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg"
            onClick={() => start("恋愛運について占う前口上を話してください")}
          >
            💖 恋愛運
          </button>
          <button
            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg"
            onClick={() => start("仕事運について占う前口上を話してください")}
          >
            💼 仕事運
          </button>
          <button
            className="px-6 py-4 bg-gradient-to-r from-lime-400 to-green-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg"
            onClick={() => start("金運について占う前口上を話してください")}
          >
            💰 金運
          </button>
          <button
            className="px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg"
            onClick={() => start("健康運について占う前口上を話してください")}
          >
            💪 健康運
          </button>
          <button
            className="px-6 py-4 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg"
            onClick={() => start("対人運について占う前口上を話してください")}
          >
            🤝 対人運
          </button>
        </div>
      )}
      {state === "loading" && <LoadingSpinner />}
      {(state === "playing" || state === "done") && (
        <div className="bg-black/40 p-6 rounded-xl shadow-lg w-full max-w-2xl min-h-[100px] flex items-center justify-center">
          <p className="whitespace-pre-wrap text-lg font-serif leading-relaxed text-center">
            {displayedText}
          </p>
        </div>
      )}
      {state === "done" && <DrawCardButton className="mt-8" />}
    </main>
  );
}
