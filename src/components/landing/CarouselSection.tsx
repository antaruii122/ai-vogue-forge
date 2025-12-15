import carousel1 from "@/assets/carousel-1.png";
import carousel2 from "@/assets/carousel-2.png";
import carousel3 from "@/assets/carousel-3.png";
import carousel4 from "@/assets/carousel-4.png";
import carousel5 from "@/assets/carousel-5.png";
import carousel6 from "@/assets/carousel-6.png";
import carousel7 from "@/assets/carousel-7.png";
import carousel8 from "@/assets/carousel-8.png";
import carousel9 from "@/assets/carousel-9.png";
import carousel10 from "@/assets/carousel-10.png";
import carousel11 from "@/assets/carousel-11.png";
import carousel12 from "@/assets/carousel-12.png";
import carousel13 from "@/assets/carousel-13.png";

export const CarouselSection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center">
          See How Fashion Styles Look
        </h2>
      </div>
      
      {/* Top Row - Scrolls Left */}
      <div className="relative mb-6">
        <div className="flex gap-6 animate-scroll-left">
          {/* First set of images */}
          <div className="flex gap-6 flex-shrink-0">
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel1} alt="Fashion style 1" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel2} alt="Fashion style 2" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel3} alt="Fashion style 3" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel4} alt="Fashion style 4" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel5} alt="Fashion style 5" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel6} alt="Fashion style 6" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel7} alt="Fashion style 7" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex gap-6 flex-shrink-0">
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel1} alt="Fashion style 1" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel2} alt="Fashion style 2" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel3} alt="Fashion style 3" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel4} alt="Fashion style 4" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel5} alt="Fashion style 5" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel6} alt="Fashion style 6" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel7} alt="Fashion style 7" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Row - Scrolls Right */}
      <div className="relative">
        <div className="flex gap-6 animate-scroll-right">
          {/* First set of images */}
          <div className="flex gap-6 flex-shrink-0">
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel8} alt="Fashion style 8" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel9} alt="Fashion style 9" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel10} alt="Fashion style 10" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel11} alt="Fashion style 11" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel12} alt="Fashion style 12" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel13} alt="Fashion style 13" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel1} alt="Fashion style 1" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex gap-6 flex-shrink-0">
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel8} alt="Fashion style 8" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel9} alt="Fashion style 9" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel10} alt="Fashion style 10" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel11} alt="Fashion style 11" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel12} alt="Fashion style 12" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel13} alt="Fashion style 13" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
              <img src={carousel1} alt="Fashion style 1" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
