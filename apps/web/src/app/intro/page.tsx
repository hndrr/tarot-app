"use client";

import { useState } from "react"; // useState をインポート
import { DrawCardButton } from "@/components/DrawCardButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNarrationFlow } from "@/hooks/useNarrationFlow";

export default function FortunePage() {
  const { displayedText, state, start } = useNarrationFlow();
  const [enableAudio, setEnableAudio] = useState(true);

  const handleStartNarration = (prompt: string) => {
    start(`${prompt}について占う前口上を話してください`, enableAudio);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-black text-white p-8">
      {state === "idle" && (
        <>
          <h1 className="text-3xl font-bold mb-8">何を占いますか？</h1>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm">音声ON</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={enableAudio}
                onChange={() => setEnableAudio(!enableAudio)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </>
      )}
      {state === "idle" && (
        <div className="grid grid-cols-2 gap-4 my-8 w-full max-w-md">
          <button
            className="px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg break-keep"
            onClick={() =>
              handleStartNarration("今日の運勢を占う前口上を話してください")
            }
          >
            🔮 今日の運勢
          </button>
          <button
            className="px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg"
            onClick={() =>
              handleStartNarration("恋愛運について占う前口上を話してください")
            }
          >
            💖 恋愛運
          </button>
          <button
            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg"
            onClick={() => handleStartNarration("仕事運")}
          >
            💼 仕事運
          </button>
          <button
            className="px-6 py-4 bg-gradient-to-r from-lime-400 to-green-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg"
            onClick={() => handleStartNarration("金運")}
          >
            💰 金運
          </button>
          <button
            className="px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg"
            onClick={() => handleStartNarration("健康運")}
          >
            💪 健康運
          </button>
          <button
            className="px-6 py-4 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-white font-semibold text-lg"
            onClick={() => handleStartNarration("対人運")}
          >
            🤝 対人運
          </button>
        </div>
      )}
      {state === "loading" && <LoadingSpinner />}
      {(state === "playing" || state === "done") && (
        <>
          <div className="bg-black/40 p-6 rounded-xl shadow-lg w-full max-w-2xl min-h-[100px] flex items-center justify-center">
            <p className="whitespace-pre-wrap text-lg font-serif leading-relaxed text-center">
              {displayedText}
            </p>
          </div>
          <DrawCardButton
            className="mt-8 disabled:opacity-80 disabled:cursor-not-allowed"
            disabled={state !== "done"}
          />
        </>
      )}
    </main>
  );
}
