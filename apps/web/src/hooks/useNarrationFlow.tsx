import { useState } from "react";

type NarrationState = "idle" | "loading" | "playing" | "done";

type UseNarrationFlowResult = {
  displayedText: string;
  fullText: string;
  state: NarrationState;
  start: (prompt: string, enableAudio: boolean) => void;
};

export const useNarrationFlow = (): UseNarrationFlowResult => {
  const [fullText, setFullText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [state, setState] = useState<NarrationState>("idle");

  const PLAYBACK_RATE = 1.1;
  const LOADING_INTERVAL = 90;

  const start = async (prompt: string, enableAudio: boolean) => {
    // 引数名を theme から prompt に変更
    setState("loading");
    setDisplayedText("");
    console.log(
      "[useNarrationFlow] start called with prompt:",
      prompt,
      "enableAudio:",
      enableAudio
    );

    try {
      console.log("[useNarrationFlow] Fetching /api/narration...");
      const res = await fetch("/api/narration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, enableAudio }),
      });

      console.log("[useNarrationFlow] fetch response status:", res.status);

      let data: {
        text?: string;
        audioBase64?: string;
        contentType?: string;
      } = {};
      let text: string = "";
      let audioBase64: string = "";
      let contentType: string = "";

      if (res.ok) {
        data = await res.json();
        console.log("[useNarrationFlow] fetch response data:", data);
        text = data.text ?? "";
        audioBase64 = data.audioBase64 ?? "";
        contentType = data.contentType ?? "";
      } else {
        try {
          const resData = await res.json();
          data = resData ?? {};
          text = data.text ?? "";
        } catch {
          text = "";
        }
        console.error(
          "[useNarrationFlow] fetch failed:",
          res.status,
          res.statusText
        );
        // エラー時もテキストは表示し、音声はなし
        setFullText(text);
        setDisplayedText(text);
        setState("done");
        return;
      }

      setFullText(text);
      setState("playing");

      // 音声再生
      let audio: HTMLAudioElement | null = null;
      if (enableAudio && audioBase64 && contentType) {
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
      }

      // タイプライター風表示
      let localIndex = 0; // 変数名を変更
      const interval = setInterval(() => {
        if (localIndex >= text.length) {
          // index が範囲外になったらすぐにクリア
          clearInterval(interval);
          return; // 何もせずに終了
        }
        // index をインクリメントしてから部分文字列で表示テキストを更新
        localIndex++;
        setDisplayedText(text.substring(0, localIndex));
      }, LOADING_INTERVAL);

      // 音声再生が有効な場合のみonended/onerrorを設定
      if (audio) {
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
      } else {
        // 音声再生が無効な場合は、タイプライターアニメーション終了時にdoneにする
        const checkInterval = setInterval(() => {
          if (localIndex >= text.length) {
            clearInterval(checkInterval);
            setState("done");
          }
        }, LOADING_INTERVAL);
      }
    } catch (err) {
      console.error("[useNarrationFlow] Unexpected error:", err);
      setDisplayedText("");
      setState("done");
    }
  };

  return { displayedText, fullText, state, start };
};
