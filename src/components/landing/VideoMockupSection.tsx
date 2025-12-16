import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ArrowRight } from "lucide-react";
import heroThumbnail1 from "@/assets/hero-thumbnail-1.png";
import heroThumbnail2 from "@/assets/hero-thumbnail-2.png";
import heroThumbnail3 from "@/assets/hero-thumbnail-3.png";

interface VideoMockupSectionProps {
  isLoggedIn: boolean;
}

export const VideoMockupSection = ({ isLoggedIn }: VideoMockupSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Side: Instagram Stories-style Mockup */}
            <div className="relative">
              <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden max-w-[380px] mx-auto shadow-2xl border border-gray-800">
                {/* App Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <div className="flex items-center gap-1">
                    <span className="text-white font-semibold">Provamoda</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <span>9:41</span>
                    <div className="w-6 h-3 border border-white rounded-sm relative">
                      <div className="absolute inset-0.5 bg-white rounded-sm" style={{
                        width: '70%'
                      }} />
                    </div>
                  </div>
                </div>
                
                {/* Stories Row */}
                <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-800">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      PM
                    </div>
                    <span className="text-gray-400 text-xs">You</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-full bg-gray-600 overflow-hidden">
                      <img src={heroThumbnail1} alt="Luma" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-gray-400 text-xs">Luma</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-full bg-gray-600 overflow-hidden">
                      <img src={heroThumbnail2} alt="Radius" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-gray-400 text-xs">Radius</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-full bg-gray-600 overflow-hidden">
                      <img src={heroThumbnail3} alt="Halo" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-gray-400 text-xs">Halo</span>
                  </div>
                </div>
                
                {/* Post Header */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Provamoda Studio</p>
                      <p className="text-gray-400 text-xs">Sponsored • Fashion</p>
                    </div>
                  </div>
                  <span className="text-gray-500">•••</span>
                </div>
                
                {/* Video Content */}
                <div className="aspect-[4/5] bg-black overflow-hidden">
                  <video src="/videos/social-mockup.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline />
                </div>
                
                {/* CTA Button */}
                <div className="px-4 py-3">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2">
                    Launch your visual campaign
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Engagement Stats */}
                <div className="flex items-center justify-between px-4 pb-4 text-gray-400 text-sm">
                  <span>312 likes • 8 comments</span>
                  <span className="text-gray-400">View insights</span>
                </div>
              </div>
            </div>
            
            {/* Right Side: Content */}
            <div className="space-y-8">
              <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">Motion from Stills</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                Turn Provamoda photos into scrolling-stopping fashion videos.
              </h2>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Feed any Provamoda still into our motion engine, describe the mood in a sentence, and generate vertical-ready videos that feel like full productions – without reshoots.
              </p>
              
              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center flex-shrink-0 text-cyan-400 font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Pick your hero still</h4>
                    <p className="text-foreground/60 text-sm leading-relaxed">Start from any Provamoda shot you love – a lookbook pose, e-commerce angle, or campaign hero image.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center flex-shrink-0 text-cyan-400 font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Type a motion prompt</h4>
                    <p className="text-foreground/60 text-sm leading-relaxed">Describe the movement you want – e.g. "slow pan down, soft camera shake, studio lights pulsing to the beat".</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center flex-shrink-0 text-cyan-400 font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Export ready-to-post clips</h4>
                    <p className="text-foreground/60 text-sm leading-relaxed">Download vertical videos in the right aspect ratios for Reels, TikTok, and Stories – no extra editing needed.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pt-4">
                <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-800" onClick={() => navigate(isLoggedIn ? "/video-generation" : "/signup")}>
                  Generate a sample video
                </Button>
                <span className="text-foreground/50 text-sm">Built for AI models, optimized for social feeds.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
