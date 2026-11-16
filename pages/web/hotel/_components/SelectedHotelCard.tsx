import { useQuery } from "@tanstack/react-query";
import { Check, ChevronRight, MapPin, Star, UtensilsCrossed } from "lucide-react";
import ImageFallback from "@/components/ImageFallback";
import {
  getHotelInfo,
  getHotelPhotoSrc,
  HOTEL_IMAGE_PLACEHOLDER,
} from "@/graphql/hotel";
import { HotelSearchResultT } from "@/types/hotel.type";
import { useUser } from "@/provider/UserProvider";
import { formatPrice } from "@/lib/utils";
import PriceLoader from "./PriceLoader";
import RecommendedToggle from "./RecommendedToggle";

type Props = {
  hotel: { id: string; name: string };
  /** The hotel's row in the search results (with its price), once it is there. */
  data: HotelSearchResultT | null;
  /** The search is still running. */
  pricePending: boolean;
  /** The finished search has no rooms here for the chosen dates and guests. */
  noRooms: boolean;
  nights: number;
  handleNavigate: (e: React.MouseEvent, path: string) => void;
};

const MAX_AMENITIES = 3;
const amenityLabel = (tag: string) =>
  tag.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * The hotel picked in the search box, above the other hotels of its area (horizontal card). Photo, stars and
 * address come from the hotel info (shared with the detail page's cache), so the card is complete before the
 * search answers; the search row, when the hotel is in it, adds the price.
 */
const SelectedHotelCard = ({
  hotel,
  data,
  pricePending,
  noRooms,
  nights,
  handleNavigate,
}: Props) => {
  const { user } = useUser();
  const { data: info } = useQuery({
    queryKey: ["hotelInfo", hotel.id],
    queryFn: () => getHotelInfo(hotel.id),
    staleTime: 5 * 60 * 1000,
  });

  const name = data?.name ?? info?.name ?? hotel.name;
  const stars = Math.min(5, data?.star_rating ?? info?.star_rating ?? 0);
  const images = data?.images?.length ? data.images : (info?.images ?? null);
  const meta = data?.region_meta ?? info?.region_meta;
  const location =
    [meta?.name, meta?.country_name].filter(Boolean).join(", ") ||
    data?.address ||
    info?.address ||
    "";

  const bestRate = data?.rates?.[0];
  const currency = bestRate?.show_currency_code ?? "USD";
  const perNight =
    Number(bestRate?.show_amount_per_night) > 0
      ? Number(bestRate?.show_amount_per_night)
      : Number(bestRate?.show_amount) > 0
        ? Math.round(Number(bestRate?.show_amount) / nights)
        : null;
  const stayTotal = Number(bestRate?.show_amount);
  const amenities = (bestRate?.room_amenities ?? []).slice(0, MAX_AMENITIES);
  const path = `/hotels/${hotel.id}`;

  return (
    <div
      onClick={(e) => handleNavigate(e, path)}
      className="group mb-6 flex cursor-pointer flex-col overflow-hidden rounded-xl border border-indigo-200 bg-indigo-50 transition-shadow hover:shadow-md sm:min-h-41 sm:flex-row"
    >
      <div className="relative h-40 shrink-0 overflow-hidden sm:h-auto sm:w-60">
        <ImageFallback
          src={getHotelPhotoSrc(images, "828x560")}
          fallbackSrc={HOTEL_IMAGE_PLACEHOLDER}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 flex h-7 items-center rounded-md bg-[#ecf8ed] px-3 text-[13px] font-medium text-[#3ca743]">
          Selected Hotel
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
            <h2 className="min-w-0 truncate text-base font-bold text-[#101828] sm:text-lg">
              {name}
            </h2>
            {stars > 0 && (
              <span
                role="img"
                aria-label={`${stars} star hotel`}
                className="flex shrink-0 gap-0.5 text-amber-400"
              >
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
            )}
          </div>

          {location && (
            <div className="flex min-w-0 items-center gap-1.5">
              <MapPin className="size-4 shrink-0 text-[#475467]" />
              <span className="truncate text-sm text-[#475467]">{location}</span>
            </div>
          )}

          {(bestRate?.has_breakfast || amenities.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {bestRate?.has_breakfast && (
                <span className="flex items-center gap-1 rounded-md bg-[#E6F4EA] px-2 py-0.5 text-[13px] text-[#2D7F3E]">
                  <UtensilsCrossed size={12} /> Breakfast
                </span>
              )}
              {amenities.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[#e4e7ec] px-2 py-0.5 text-[13px] text-[#344054]"
                >
                  {amenityLabel(tag)}
                </span>
              ))}
            </div>
          )}

          {!!bestRate?.free_cancellation_before && (
            <div className="flex items-center gap-1.5">
              <Check className="size-3.5 shrink-0 text-emerald-600" strokeWidth={2.4} />
              <span className="text-[13px] text-emerald-700">Free cancellation</span>
            </div>
          )}

          {data && (
            <div className="flex items-center gap-2">
              <RecommendedToggle hotelId={data.id} isRecommended={data.isRecommended} />
              <span className="text-xs text-gray-500">Recommended</span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-end justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
          {pricePending ? (
            <PriceLoader />
          ) : perNight !== null ? (
            <div className="flex flex-col whitespace-nowrap sm:items-end">
              <span className="text-[13px] text-[#667085]">from</span>
              <span className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-[#101828]">
                  {formatPrice(perNight, currency)}
                </span>
                <span className="text-sm text-[#344054]">/night</span>
              </span>
              {stayTotal > 0 && (
                <span className="text-xs text-gray-500">
                  {formatPrice(stayTotal, currency)} total · {nights}{" "}
                  {nights === 1 ? "night" : "nights"}
                </span>
              )}
              {user?.type === "OWNER" && bestRate?.etg_amount_per_night && (
                <span className="text-xs text-gray-400">
                  Supplier:{" "}
                  {formatPrice(bestRate.etg_amount_per_night, bestRate.etg_currency_code)}{" "}
                  / night
                </span>
              )}
            </div>
          ) : noRooms ? (
            <span className="text-[13px] text-[#667085] sm:text-right">
              No rooms for these dates
            </span>
          ) : (
            <span />
          )}
          <button
            onClick={(e) => handleNavigate(e, path)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0px_4px_10px_0px_rgba(79,70,229,0.25)] transition-colors hover:bg-indigo-700"
          >
            View Rooms
            <ChevronRight className="size-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedHotelCard;
