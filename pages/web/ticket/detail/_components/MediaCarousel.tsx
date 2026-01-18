import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { preFixImg } from "@/util/initData";

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
  onNext,
  onPrev,
  setIndex,
  isRecommended,
  isInstant,
  productName,
}) => {
  if (mediaList.length === 0) return null;

  return (
    <div className="w-full h-100 rounded-3xl overflow-hidden mb-8 shadow-lg relative group">
      <img
        src={mediaList[currentIndex].path}
        alt={productName}
        className="w-full h-full object-cover transition-all duration-500"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

      {mediaList.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-6 left-[60%] -translate-x-[50%] -translate-y-[50%] flex gap-2">
            {mediaList.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === i ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute top-6 left-6 flex gap-3">
        {isRecommended && (
          <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Recommended
          </span>
        )}
        {isInstant && (
          <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Instant Confirm
          </span>
        )}
      </div>
    </div>
  );
};

export default MediaCarousel;
