import fs from "fs";
import path from "path";
import VideoPlayer from "@/components/VideoPlayer";
const getVideos = (): string[] => {
  const videosDir = path.join(process.cwd(), "public", "videos");
  let videos: string[] = [];
  try {
    const files = fs.readdirSync(videosDir);
    videos = files
      .filter((file) => /\.(mp4|webm)$/.test(file))
      .map((file) => `/videos/${file}`);
  } catch (error) {
    console.error("動画ディレクトリの読み込みエラー:", error);
  }
  return videos;
};

export default function VideoPage() {
  const videos = getVideos();
  return <VideoPlayer videos={videos} />;
}
