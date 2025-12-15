import { VideoComparisonCard } from "@/components/VideoComparisonCard";
import comparisonPhoto1 from "@/assets/fashion-comparison-photo.png";
import comparisonPhoto2 from "@/assets/fashion-style-2.png";
import comparisonPhoto3 from "@/assets/fashion-style-3.webp";
import comparisonPhoto4 from "@/assets/fashion-style-4.png";
import comparisonPhoto5 from "@/assets/fashion-style-5.webp";
import comparisonPhoto6 from "@/assets/carousel-4.png";

interface ExamplesSectionProps {
  currentlyPlayingVideoId: string;
  onVideoPlay: (videoId: string) => void;
}

export const ExamplesSection = ({ currentlyPlayingVideoId, onVideoPlay }: ExamplesSectionProps) => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            See What You Can Create
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click to see the before & after transformation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <VideoComparisonCard id="video-1" imageSrc={comparisonPhoto1} videoSrc="/videos/fashion-comparison.mp4" templateName="Fashion Style 1" isPlaying={currentlyPlayingVideoId === "video-1"} onPlay={onVideoPlay} />
          <VideoComparisonCard id="video-2" imageSrc={comparisonPhoto2} videoSrc="/videos/fashion-style-2.mp4" templateName="Fashion Style 2" isPlaying={currentlyPlayingVideoId === "video-2"} onPlay={onVideoPlay} />
          <VideoComparisonCard id="video-3" imageSrc={comparisonPhoto3} videoSrc="/videos/fashion-style-3.mp4?v=2" templateName="Fashion Style 3" isPlaying={currentlyPlayingVideoId === "video-3"} onPlay={onVideoPlay} />
          <VideoComparisonCard id="video-4" imageSrc={comparisonPhoto4} videoSrc="/videos/fashion-style-4.mp4" templateName="Fashion Style 4" isPlaying={currentlyPlayingVideoId === "video-4"} onPlay={onVideoPlay} />
          <VideoComparisonCard id="video-5" imageSrc={comparisonPhoto5} videoSrc="/videos/fashion-style-5.mp4" templateName="Fashion Style 5" isPlaying={currentlyPlayingVideoId === "video-5"} onPlay={onVideoPlay} />
          <VideoComparisonCard id="video-6" imageSrc={comparisonPhoto6} videoSrc="/videos/social-mockup.mp4" templateName="Fashion Style 6" isPlaying={currentlyPlayingVideoId === "video-6"} onPlay={onVideoPlay} />
        </div>
      </div>
    </section>
  );
};
