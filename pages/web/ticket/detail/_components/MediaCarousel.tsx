import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { preFixImg } from "@/util/initData";
import ImageFallback from "@/components/ImageFallback";
import Autoplay from 'embla-carousel-autoplay';

interface MediaCarouselProps {
  mediaList: any[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  setIndex: (i: number) => void;
  isRecommended: boolean;
  isInstant: boolean;
  productName: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  mediaList,
  currentIndex,
  setIndex,
  isRecommended,
  isInstant,
  productName,
}) => {
  // 1. Setup Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start', // Ensures slides fit w-full
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })] // Optional: Autoplay
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  // 2. Sync Embla scroll events with your state
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    setIndex(index);
  }, [emblaApi, setIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('init', onSelect);
  }, [emblaApi, onSelect]);

  // 3. Scroll Handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  if (mediaList.length === 0) return null;

  return (
    <div className="w-full h-[450px] rounded-3xl overflow-hidden relative group bg-gray-900 shadow-2xl">
      
      {/* Embla Viewport (The Mask) */}
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        {/* Embla Container (The Moving Track) */}
        <div className="flex h-full">
          {mediaList.map((media, index) => (
            <div 
              key={index} 
              className="flex-[0_0_100%] min-w-0 relative bg-gray-800"
            >
              <ImageFallback
                src={preFixImg(media.path)}
                alt={`${productName}-${index}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Glassmorphism Bullets */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {mediaList.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 border border-white/20 ${
              index === selectedIndex 
                ? "w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Glassmorphism Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110 z-20 shadow-xl"
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110 z-20 shadow-xl"
      >
        <ChevronRight size={24} strokeWidth={2.5} />
      </button>

      {/* Badges */}
      <div className="absolute top-6 left-6 flex gap-3 z-10 pointer-events-none">
        {isRecommended && (
          <span className="bg-indigo-600/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-indigo-400/40">
            Recommended
          </span>
        )}
        {isInstant && (
          <span className="bg-green-500/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-green-400/40">
            Instant Confirm
          </span>
        )}
      </div>
    </div>
  );
};

export default MediaCarousel;