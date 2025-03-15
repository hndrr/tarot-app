import VideoPlayer from "@/components/VideoPlayer";
import { cardVideos } from "@/data/videoUrls";

type Props = {
  params: {
    id: string;
  };
};

export default function VideoPage({ params }: Props) {
  const allVideos =
    cardVideos.find((card) => card.id === parseInt(params.id))?.videos || [];
  return <VideoPlayer videos={allVideos} isReversed={false} />;
}
