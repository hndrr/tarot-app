"use client";

import { useNarrationFlow } from "@/hooks/useNarrationFlow";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FortunePage() {
  const { displayedText, state, start } = useNarrationFlow();
  const router = useRouter();

  // ナレーション終了後に自動で遷移
  useEffect(() => {
    if (state === "done") {
      const timeout = setTimeout(() => {
        router.push("/fortune/result");
      }, 2000); // 終了後2秒待って遷移
      return () => clearTimeout(timeout);
    }
  }, [state, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">占いの前に…</h1>

      <div className="bg-black/40 p-6 rounded-xl shadow-lg w-full max-w-2xl">
        <p className="whitespace-pre-wrap text-lg font-serif leading-relaxed">
          {displayedText}
        </p>
      </div>

      {state === "idle" && (
        <button
          className="mt-8 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-lg"
          onClick={() => start("恋愛")}
        >
          ナレーションを開始
        </button>
      )}

      {state === "done" && (
        <p className="mt-4 text-sm text-gray-400">→ 占い結果に進んでいます…</p>
      )}
    </main>
  );
}
