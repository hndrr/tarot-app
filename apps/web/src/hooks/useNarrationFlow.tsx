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
    console.log("[useNarrationFlow] start called with prompt:", prompt);

    try {
      console.log("[useNarrationFlow] Fetching /api/narration...");
      const res = await fetch("/api/narration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }), // 送信するデータを prompt に変更
      });

      console.log("[useNarrationFlow] fetch response status:", res.status);

      // 失敗時もテキストだけは表示
      let data: {
        text?: string;
        audioBase64?: string;
        contentType?: string;
      } = {};
      let text: string = "";
      if (res.ok) {
        data = await res.json();
        console.log("[useNarrationFlow] fetch response data:", data);
        text = data.text ?? "";
      } else {
        try {
          const resData = await res.json();
          data = resData ?? {};
          text = data.text ?? "";
        } catch {
          data = {};
          text = "";
        }
        console.error(
          "[useNarrationFlow] fetch failed:",
          res.status,
          res.statusText
        );
        setFullText(text);
        setDisplayedText(text);
        setState("done");
        return;
      }

      const audioBase64 = data.audioBase64 ?? "";
      const contentType = data.contentType ?? "";

      // audioデータがなければテキストのみ
      if (!audioBase64 || !contentType) {
        console.error(
          "[useNarrationFlow] audioBase64 or contentType is missing!",
          { audioBase64, contentType }
        );
        setFullText(text);
        setState("playing");
        // タイプライター風表示（音声なしでもアニメーション）
        let index = 0;
        const interval = setInterval(() => {
          if (index >= text.length) {
            clearInterval(interval);
            setDisplayedText(text);
            setState("done");
            return;
          }
          index++;
          setDisplayedText(text.substring(0, index));
        }, LOADING_INTERVAL);
        return;
      }

      setFullText(text);
      setState("playing");

      // 音声再生
      let audio: HTMLAudioElement;
      try {
        audio = new Audio(`data:${contentType};base64,${audioBase64}`); // contentType を使用
        audio.playbackRate = PLAYBACK_RATE; // 再生速度を1.1倍に設定
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("[useNarrationFlow] audio.play() started");
            })
            .catch((err) => {
              console.error("[useNarrationFlow] audio.play() failed:", err);
              setDisplayedText(text);
              setState("done");
            });
        }
      } catch (err) {
        console.error(
          "[useNarrationFlow] Audio object creation/play error:",
          err
        );
        setDisplayedText(text);
        setState("done");
        return;
      }

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
        console.log("[useNarrationFlow] audio.onended called");
        clearInterval(interval); // タイマーを確実に停止
        setDisplayedText(text); // 全文を表示して不整合を防ぐ
        setState("done");
      };
      audio.onerror = (e) => {
        console.error("[useNarrationFlow] audio.onerror", e);
        setDisplayedText(text);
        setState("done");
      };
    } catch (err) {
      console.error("[useNarrationFlow] Unexpected error:", err);
      setDisplayedText("");
      setState("done");
    }
  };

  return { displayedText, fullText, state, start };
};
