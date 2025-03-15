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
  // 1つの動画だけを返す配列
  const videos: string[] = [];

  try {
    // 利用可能な動画ファイルからランダムに1つ選択
    // 各カードの利用可能な動画ファイル数を取得
    try {
      // 利用可能な動画の総数を取得
      let availableCount = 0;
      // 十分な数の動画を確認（最大値は大きめに設定）
      const maxCheck = 30;
      for (let i = 0; i < maxCheck; i++) {
        try {
          getVideoPath(card.id, i);
          availableCount++;
        } catch {
          // このインデックスに動画がない場合はスキップ
        }
      }

      // 利用可能な動画がある場合
      if (availableCount > 0) {
        // ランダムなインデックスを生成（利用可能な動画数の範囲内）
        const randomIndex = Math.floor(Math.random() * availableCount);
        const videoPath = getVideoPath(card.id, randomIndex);
        videos.push(`${process.env.NEXT_PUBLIC_CDN_URL}/${videoPath}`);
      }
    } catch (error) {
      console.error("利用可能な動画数の取得に失敗しました:", error);
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
