// app/video/VideoPlayer.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";

type VideoPlayerProps = {
  videos: string[];
  isReversed: boolean;
};

export default function VideoPlayer({ videos, isReversed }: VideoPlayerProps) {
  const [videoSrc, setVideoSrc] = useState<string>("");

  const playRandomVideo = useCallback(() => {
    if (videos.length === 0) return;
    const randomIndex = Math.floor(Math.random() * videos.length);
    setVideoSrc(videos[randomIndex]);
  }, [videos]);

  useEffect(() => {
    playRandomVideo();
  }, [playRandomVideo]);

  return (
    <div
      className={`rounded-2xl object-cover shadow-lg overflow-hidden ${
        isReversed && "rotate-180"
      }`}
    >
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          style={{ width: "100%" }}
          playsInline
        >
          お使いのブラウザは video タグに対応していません。
        </video>
      )}
    </div>
  );
}
