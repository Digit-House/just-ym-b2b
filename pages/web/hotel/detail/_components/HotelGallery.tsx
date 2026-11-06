import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageFallback from "@/components/ImageFallback";
import {
  filterValidHotelImages,
  HOTEL_IMAGE_PLACEHOLDER,
  resolveHotelImageUrl,
} from "@/graphql/hotel";

type Props = {
  images: string[];
  name: string;
  latitude?: number;
  longitude?: number;
};

const HotelGallery = ({ images, name, latitude, longitude }: Props) => {
  const [view, setView] = useState<"gallery" | "map">("gallery");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("init", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const validImages = filterValidHotelImages(images);
  const slides = validImages.length ? validImages : [""];
  const hasMap = latitude != null && longitude != null;

  return (
    <div className="w-full h-[420px] rounded-3xl overflow-hidden relative group shadow-md bg-gray-100">
      {view === "gallery" ? (
        <div className="overflow-hidden w-full h-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((img, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                <ImageFallback
                  src={
                    img
                      ? resolveHotelImageUrl(img, "640x400")
                      : HOTEL_IMAGE_PLACEHOLDER
                  }
                  fallbackSrc={HOTEL_IMAGE_PLACEHOLDER}
                  alt={`${name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <iframe
          title={`${name} location`}
          className="w-full h-full border-0"
          loading="lazy"
          src={`https://www.google.com/maps?q=${latitude},${longitude}&output=embed`}
        />
      )}

      {hasMap && (
        <div className="absolute top-4 inset-x-0 z-20 flex justify-center">
          <div className="flex bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-md">
            <button
              type="button"
              onClick={() => setView("gallery")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                view === "gallery"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Gallery View
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                view === "map"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Map View
            </button>
          </div>
        </div>
      )}

      {view === "gallery" && slides.length > 1 && (
        <>
          <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center gap-3">
            {slides.map((_, index) => (
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

          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-black flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110 z-20 shadow-xl"
          >
            <ChevronLeft size={24} strokeWidth={2.5} className="text-white" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-black flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110 z-20 shadow-xl"
          >
            <ChevronRight size={24} strokeWidth={2.5} className="text-white" />
          </button>
        </>
      )}
    </div>
  );
};

export default HotelGallery;
