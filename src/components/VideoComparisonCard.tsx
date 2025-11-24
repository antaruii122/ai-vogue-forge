import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";

interface VideoComparisonCardProps {
  imageSrc: string;
  videoSrc: string;
  templateName: string;
}

export const VideoComparisonCard = ({ imageSrc, videoSrc, templateName }: VideoComparisonCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card 
      className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer group w-full max-w-[300px] mx-auto"
      onClick={handleClick}
    >
      <div className="relative aspect-[9/16] bg-gradient-to-br from-primary/20 to-primary-purple/20">
        {/* Product Photo */}
        <img
          src={imageSrc}
          alt={templateName}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Video */}
        <video
          src={videoSrc}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay={isPlaying}
          loop
          muted
          playsInline
        />

        {/* Play/Pause Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" fill="white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" fill="white" />
            )}
          </div>
        </div>

        {/* Template Name Label */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
            <p className="text-sm font-medium">{templateName}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
