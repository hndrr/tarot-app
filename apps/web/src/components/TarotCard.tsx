import VideoPlayer from "./VideoPlayer";
import { getVideoPath, getVideoCount } from "@/lib/videoPath";

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
    // カードの動画ファイル数を取得
    const videoCount = getVideoCount(card.id);

    // 動画がある場合
    if (videoCount > 0) {
      // ランダムなインデックスを生成
      const randomIndex = Math.floor(Math.random() * videoCount);

      try {
        // 選択されたインデックスの動画を取得
        const videoPath = getVideoPath(card.id, randomIndex);
        videos.push(`${process.env.NEXT_PUBLIC_CDN_URL}/${videoPath}`);

        console.log(
          `カードID: ${card.id}, 動画数: ${videoCount}, 選択されたインデックス: ${randomIndex}`
        );
      } catch (error) {
        console.error(`動画の取得に失敗しました: ${error}`);
      }
    } else {
      console.log(`カードID: ${card.id} には動画がありません`);
    }

    // 動画が1つも取得できなかった場合は、デフォルトの動画を使用
    if (videos.length === 0) {
      // 愚者カードの動画数を取得
      const foolVideoCount = getVideoCount(1);
      if (foolVideoCount > 0) {
        const defaultIndex = Math.floor(Math.random() * foolVideoCount);
        const defaultPath = getVideoPath(1, defaultIndex);
        videos.push(`${process.env.NEXT_PUBLIC_CDN_URL}/${defaultPath}`);
        console.log(
          `デフォルト動画を使用: カードID: 1, インデックス: ${defaultIndex}`
        );
      } else {
        // 最終的なフォールバック
        videos.push(`${process.env.NEXT_PUBLIC_CDN_URL}/fool/Wan_00032.mp4`);
        console.log(`固定フォールバック動画を使用`);
      }
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
