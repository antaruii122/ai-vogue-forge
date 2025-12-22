import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import heroPhoto1 from "@/assets/hero-photo-1.png";
import heroPhoto2 from "@/assets/hero-photo-2.png";
import heroPhoto3 from "@/assets/hero-photo-3.png";
import heroPhoto4 from "@/assets/hero-photo-4.png";
import heroThumbnail1 from "@/assets/hero-thumbnail-1.png";
import heroThumbnail2 from "@/assets/hero-thumbnail-2.png";
import heroThumbnail3 from "@/assets/hero-thumbnail-3.png";
import heroThumbnail4 from "@/assets/hero-thumbnail-4.png";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export const HeroSection = ({ isLoggedIn }: HeroSectionProps) => {
  const navigate = useNavigate();

  const photos = [
    { main: heroPhoto1, thumb: heroThumbnail1, rotate: -5, thumbRotate: 8, delay: "delay-100" },
    { main: heroPhoto2, thumb: heroThumbnail2, rotate: 3, thumbRotate: -6, delay: "delay-200" },
    { main: heroPhoto3, thumb: heroThumbnail3, rotate: -4, thumbRotate: 10, delay: "delay-300" },
    { main: heroPhoto4, thumb: heroThumbnail4, rotate: 6, thumbRotate: -5, delay: "delay-500" },
  ];

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] via-[#0f0728] to-background" />
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-primary/40 rounded-full animate-float" />
        <div className="absolute top-40 right-[15%] w-3 h-3 bg-primary-purple/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-[20%] w-2 h-2 bg-emerald-500/30 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/2 right-[8%] w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Text Content with staggered animations */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground opacity-0 animate-fade-in-up">
              Fashion Photography Made Easy
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Transform your products into stunning professional photography with AI-powered precision and style
            </p>
          </div>

          {/* CTA Button with glow effect */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 relative overflow-hidden group transition-all duration-300 hover:scale-105 animate-pulse-glow" 
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-bounce-subtle" />
                Get Started Free
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              No credit card required
            </p>
          </div>

          {/* Horizontal Grid of 4 Polaroid-Style Photos */}
          <div className="flex justify-center items-center gap-4 md:gap-6 max-w-6xl mx-auto">
            {photos.map((photo, index) => (
              <div 
                key={index}
                className={`relative rounded-sm shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:scale-105 cursor-pointer opacity-0 animate-fade-in-scale ${photo.delay}`}
                style={{
                  transform: `rotate(${photo.rotate}deg)`,
                  zIndex: (index + 1) * 10,
                }}
              >
                <div className="w-[180px] md:w-[260px] h-[230px] md:h-[340px] rounded-sm overflow-hidden">
                  <img 
                    src={photo.main} 
                    alt={`Fashion photo ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                    fetchPriority={index === 0 ? "high" : undefined}
                    loading={index === 0 ? undefined : "lazy"}
                  />
                </div>
                {/* Thumbnail Slot with float animation */}
                <div 
                  className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-white p-1 md:p-1.5 rounded-sm shadow-lg transition-transform duration-300 hover:scale-110"
                  style={{
                    transform: `rotate(${photo.thumbRotate}deg)`,
                  }}
                >
                  <img 
                    src={photo.thumb} 
                    alt={`Product thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover rounded-sm" 
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};