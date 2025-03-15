import VideoPlayer from "./VideoPlayer";
import fs from "fs";
import path from "path";

type TarotCardProps = {
  card: {
    id: number;
    name: string;
    image: string;
    meaning: string;
  };
  isReversed: boolean;
};

// カード名の日本語から英語へのマッピング
const cardNameMapping: { [key: string]: string } = {
  愚者: "fool",
  魔術師: "magician",
  女教皇: "high-priestess",
  女帝: "empress",
  皇帝: "emperor",
  教皇: "hierophant",
  恋人: "lovers",
  戦車: "chariot",
  力: "strength",
  隠者: "hermit",
  運命の輪: "wheel-of-fortune",
  正義: "justice",
  吊るされた男: "hanged-man",
  死神: "death",
  節制: "temperance",
  悪魔: "devil",
  塔: "tower",
  星: "star",
  月: "moon",
  太陽: "sun",
  審判: "judgement",
  世界: "world",
};

const getVideos = (cardName: string): string[] => {
  const englishName =
    cardNameMapping[cardName] || cardName.toLowerCase().replace(/\s+/g, "-");
  const videosPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "videos",
    englishName
  );
  let videos: string[] = [];

  try {
    const files = fs.readdirSync(videosPath);
    videos = files
      .filter((file) => /\.(mp4|webm)$/.test(file))
      .map((file) => `/assets/videos/${englishName}/${file}`);
  } catch (error) {
    console.error("動画ディレクトリの読み込みエラー:", error);
  }

  return videos;
};

export default function TarotCard({ card, isReversed }: TarotCardProps) {
  const videos = getVideos(card.name);

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
