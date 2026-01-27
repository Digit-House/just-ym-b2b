import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { relatedProducts } from "@/graphql/product";
import { ProductT } from "@/types/product.type";
import { UserT } from "@/types/user.type";
import TicketCard from "./TicketCard";
import { useUser } from "@/provider/UserProvider";

interface RelatedTicketsCarouselProps {
  ticketId: string;
  isPublished: boolean;
}

const RelatedTicketsCarousel: React.FC<RelatedTicketsCarouselProps> = ({
  ticketId,
  isPublished,
}) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [relatedTickets, setRelatedTickets] = useState<ProductT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true, // Makes scrolling feel more natural/momentum-based
    breakpoints: {
      "(min-width: 1280px)": { slidesToScroll: 4, dragFree: false }, // xl: 4 slides
      "(min-width: 1024px)": { slidesToScroll: 3, dragFree: false }, // lg: 3 slides
      "(min-width: 768px)": { slidesToScroll: 2 }, // md: 2 slides
      "(max-width: 767px)": { slidesToScroll: 1 }, // mobile: 1 slide
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch related tickets
  useEffect(() => {
    const fetchRelatedTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await relatedProducts(ticketId, isPublished);
        setRelatedTickets(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch related tickets:", err);
        setError("Failed to load related tickets");
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchRelatedTickets();
    }
  }, [ticketId, isPublished]);

  // Sync carousel index
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

  // Navigation functions
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const handleNavigate = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };

  // Don't render if no related tickets
  if (!loading && relatedTickets.length === 0) {
    return null;
  }

  return (
    <section className="py-10 w-full">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Related Tickets
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-5 min-h-[300px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm font-medium animate-pulse">Finding related tickets...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 bg-red-50 rounded-xl border border-red-100">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <div className="relative group/carousel">
            
            {/* Carousel Viewport */}
            <div className="overflow-hidden rounded-xl" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {relatedTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex-[0_0_100%]  md:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0 px-0" // px-3 creates the gap between cards
                  >
                    <TicketCard
                      user={user as UserT}
                      p={ticket}
                      handleNavigate={handleNavigate}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* <button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-4 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-800 rounded-full p-3 shadow-lg hover:scale-110 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed z-10"
              onClick={scrollPrev}
              disabled={!emblaApi?.canScrollPrev()}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-4 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-800 rounded-full p-3 shadow-lg hover:scale-110 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed z-10"
              onClick={scrollNext}
              disabled={!emblaApi?.canScrollNext()}
              aria-label="Next slide"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button> */}

            {/* Pagination Dots */}
            {relatedTickets.length > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {relatedTickets.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? "w-6 bg-indigo-600"
                        : "w-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedTicketsCarousel;