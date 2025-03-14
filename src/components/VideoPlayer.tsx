// app/video/VideoPlayer.tsx
"use client";

import React, { useState, useEffect } from "react";

type Props = {
  videos: string[];
};

export default function VideoPlayer({ videos }: Props) {
  const [videoSrc, setVideoSrc] = useState<string>("");

  // ページロード時に自動的にランダムな動画を再生する
  useEffect(() => {
    if (videos.length === 0) return;
    const randomIndex = Math.floor(Math.random() * videos.length);
    setVideoSrc(videos[randomIndex]);
  }, [videos]);

  return (
    <div>
      {videoSrc && (
        <video src={videoSrc} autoPlay muted loop style={{ width: "100%" }}>
          お使いのブラウザは video タグに対応していません。
        </video>
      )}
    </div>
  );
}
