import { useState } from "react";

type NarrationState = "idle" | "loading" | "playing" | "done";

type UseNarrationFlowResult = {
  displayedText: string;
  fullText: string;
  state: NarrationState;
  start: (theme: string) => void;
};

export const useNarrationFlow = (): UseNarrationFlowResult => {
  const [fullText, setFullText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [state, setState] = useState<NarrationState>("idle");

  const start = async (theme: string) => {
    setState("loading");
    setDisplayedText("");

    const res = await fetch("/api/narration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme }),
    });

    const data = await res.json();
    const text: string = data.text;
    const audioBase64: string = data.audioBase64;

    setFullText(text);
    setState("playing");

    // 音声再生
    const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
    audio.play();

    // タイプライター風表示
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 50);

    // 音声終わったらステータスを更新
    audio.onended = () => {
      setState("done");
    };
  };

  return { displayedText, fullText, state, start };
};
