import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
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

  /** ---------------- EMBLA SETUP ---------------- */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true,
    breakpoints: {
      "(min-width: 1280px)": { slidesToScroll: 4, dragFree: false },
      "(min-width: 1024px)": { slidesToScroll: 3, dragFree: false },
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(max-width: 767px)": { slidesToScroll: 1 },
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  /** ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchRelatedTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await relatedProducts(ticketId, isPublished);
        setRelatedTickets(res?.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load related tickets");
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) fetchRelatedTickets();
  }, [ticketId, isPublished]);

  /** ---------------- EMBLA EVENTS ---------------- */
  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onInit();
    onSelect();

    emblaApi.on("init", onInit);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  // Recalculate when slides change
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [relatedTickets, emblaApi]);

  /** ---------------- NAVIGATION ---------------- */
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleNavigate = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };

  if (!loading && relatedTickets.length === 0) return null;

  return (
    <section className="py-10 w-full">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Related Tickets
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-5 min-h-[300px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-medium animate-pulse">
                Finding related tickets...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 bg-red-50 rounded-xl border border-red-100">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <div className="relative group">
            {/* Prev Button */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full disabled:opacity-30"
            >
              ‹
            </button>

            {/* Viewport */}
            <div className="overflow-hidden rounded-xl" ref={emblaRef}>
              <div className="flex gap-5 touch-pan-y">
                {relatedTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0"
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

            {/* Next Button */}
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full disabled:opacity-30"
            >
              ›
            </button>

            {/* Pagination */}
            {scrollSnaps.length > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? "w-6 bg-indigo-600"
                        : "w-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
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
