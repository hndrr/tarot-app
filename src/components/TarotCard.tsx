import VideoPlayer from "./VideoPlayer";
import { getVideoPath } from "@/lib/videoPath";

type TarotCardProps = {
  card: {
    id: number;
    name: string;
    image: string;
    meaning: string;
  };
  isReversed: boolean;
};

const getVideos = (card: { id: number }): string[] => {
  const videos: string[] = [];

  try {
    // カードに対応する動画ファイルを取得
    // 最大3つまで取得を試みる
    for (let i = 0; i < 3; i++) {
      try {
        const videoPath = getVideoPath(card.id, i);
        videos.push(`${process.env.NEXT_PUBLIC_CDN_URL}/${videoPath}`);
      } catch (error) {
        console.error(`動画ファイル ${i + 1} の取得エラー:`, error);
      }
    }

    // 動画が1つも取得できなかった場合は、デフォルトの動画を使用
    if (videos.length === 0) {
      const defaultPath = getVideoPath(1, 0); // 愚者カードの最初の動画
      videos.push(`${process.env.NEXT_PUBLIC_CDN_URL}/${defaultPath}`);
    }
  } catch (error) {
    console.error("動画パスの取得に失敗しました:", error);
    // 最終的なフォールバック
    videos.push(`${process.env.NEXT_PUBLIC_CDN_URL}/fool/Wan_00032.mp4`);
  }

  return videos;
};

export default function TarotCard({ card, isReversed }: TarotCardProps) {
  const videos = getVideos(card);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-[9/16] max-w-96 rounded-2xl overflow-hidden">
        <VideoPlayer videos={videos} isReversed={isReversed} />
      </div>
      <h3 className="text-3xl font-bold">{card.name}</h3>
      <span className="text-xl text-gray-200 font-bold">
        {isReversed ? "逆位置" : "正位置"}
      </span>
      <p className="text-xl text-gray-200">{card.meaning}</p>
    </div>
  );
}
