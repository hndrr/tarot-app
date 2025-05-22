import { useState } from "react";

type NarrationState = "idle" | "loading" | "playing" | "done";

type UseNarrationFlowResult = {
  displayedText: string;
  fullText: string;
  state: NarrationState;
  start: (prompt: string) => void; // 引数名を theme から prompt に変更
};

export const useNarrationFlow = (): UseNarrationFlowResult => {
  const [fullText, setFullText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [state, setState] = useState<NarrationState>("idle");

  const PLAYBACK_RATE = 1.1;
  const LOADING_INTERVAL = 90;

  const start = async (prompt: string) => {
    // 引数名を theme から prompt に変更
    setState("loading");
    setDisplayedText("");

    const res = await fetch("/api/narration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }), // 送信するデータを prompt に変更
    });

    const data = await res.json();
    const text: string = data.text;
    const audioBase64: string = data.audioBase64;
    const contentType: string = data.contentType; // contentType を受け取る

    setFullText(text);
    setState("playing");

    // 音声再生
    const audio = new Audio(`data:${contentType};base64,${audioBase64}`); // contentType を使用
    audio.playbackRate = PLAYBACK_RATE; // 再生速度を1.1倍に設定
    audio.play();

    // タイプライター風表示
    let index = 0;
    const interval = setInterval(() => {
      if (index >= text.length) {
        // index が範囲外になったらすぐにクリア
        clearInterval(interval);
        return; // 何もせずに終了
      }
      // index をインクリメントしてから部分文字列で表示テキストを更新
      index++;
      setDisplayedText(text.substring(0, index));
    }, LOADING_INTERVAL);

    // 音声終わったらステータスを更新し、テキスト表示を確定
    audio.onended = () => {
      clearInterval(interval); // タイマーを確実に停止
      setDisplayedText(text); // 全文を表示して不整合を防ぐ
      setState("done");
    };
  };

  return { displayedText, fullText, state, start };
};
