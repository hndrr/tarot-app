"use client";

import React, { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  uprightAudioBase64?: string;
  reversedAudioBase64?: string;
  isReversed: boolean; // カードが逆位置かどうか
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  uprightAudioBase64,
  reversedAudioBase64,
  isReversed,
}) => {
  // 位置に応じた音声データを選択
  const audioBase64 = isReversed ? reversedAudioBase64 : uprightAudioBase64;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (audioBase64 && audioRef.current) {
      const audioSrc = `data:audio/mp3;base64,${audioBase64}`;
      audioRef.current.src = audioSrc;
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [audioBase64]);

  const togglePlay = () => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 再生終了時のハンドラ
  const handleEnded = () => {
    setIsPlaying(false);
  };

  if (!audioBase64) {
    // 該当する位置の音声データがない場合は何も表示しない
    return null; // 音声データがない場合は何も表示しない
  }

  return (
    <div className="mt-4 flex items-center">
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onError={() => setIsLoaded(false)}
      />
      <button
        onClick={togglePlay}
        disabled={!isLoaded}
        className={`flex items-center justify-center px-4 py-2 rounded-full 
          ${
            isPlaying
              ? "bg-purple-700 hover:bg-purple-800"
              : "bg-indigo-600 hover:bg-indigo-700"
          } 
          text-white transition-colors duration-300
          ${!isLoaded ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="mr-2">
          {isPlaying ? (
            // 一時停止アイコン
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
            </svg>
          ) : (
            // 再生アイコン
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
            </svg>
          )}
        </span>
        {isPlaying
          ? "一時停止"
          : `${isReversed ? "逆位置" : "正位置"}の解釈を再生`}
      </button>
    </div>
  );
};
