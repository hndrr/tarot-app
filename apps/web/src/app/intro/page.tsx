"use client";

import { DrawCardButton } from "@/components/DrawCardButton";
import { useNarrationFlow } from "@/hooks/useNarrationFlow";
// import { useRef } from "react"; // useRef も不要になったため削除

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
      <h1 className="text-3xl font-bold mb-8">占いの前に…</h1>
      {state !== "loading" && (
        <div className="bg-black/40 p-6 rounded-xl shadow-lg w-full max-w-2xl">
          <p className="whitespace-pre-wrap text-lg font-serif leading-relaxed">
            {displayedText}
          </p>
        </div>
      )}
      {state === "idle" && ( // ボタンのコメントアウトを解除
        <button
          className="my-8 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-lg"
          onClick={() => start("恋愛")} // クリック時にナレーションを開始
        >
          ナレーションを開始
        </button>
      )}
      {state !== "done" && <DrawCardButton />}
    </main>
  );
}
