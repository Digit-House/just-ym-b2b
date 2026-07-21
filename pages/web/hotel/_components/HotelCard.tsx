import { useEffect, useState } from "react";
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import ImageFallback from "@/components/ImageFallback";
import { Switch } from "@/components/ui/switch";
import {
  getHotelPhotoSrc,
  HOTEL_IMAGE_PLACEHOLDER,
  updateHotel,
} from "@/graphql/hotel";
import { getErrMsg } from "@/util/initData";
import { HotelSearchResultT } from "@/types/hotel.type";

type Props = {
  hotel: HotelSearchResultT;
  handleNavigate: (e: React.MouseEvent, path: string) => void;
};

const HotelCard = ({ hotel, handleNavigate }: Props) => {
  const bestRate = hotel.rates?.[0];
  const hasFreeCancellation = !!bestRate?.free_cancellation_before;
  const photoSrc = getHotelPhotoSrc(hotel.images, "828x560");

  const [recommended, setRecommended] = useState(!!hotel.isRecommended);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRecommended(!!hotel.isRecommended);
  }, [hotel.isRecommended]);

  // Optimistic toggle — flip immediately, revert if the mutation fails.
  const handleToggleRecommended = async (checked: boolean) => {
    setRecommended(checked);
    setSaving(true);
    try {
      await updateHotel({ id: hotel.id, isRecommended: checked });
      toast.success(
        checked ? "Marked as recommended" : "Removed from recommended",
      );
    } catch (err) {
      setRecommended(!checked);
      toast.error(getErrMsg(err, "message"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={(e) => handleNavigate(e, `/hotels/${hotel.id}`)}
      className="bg-white rounded-2xl min-h-[420px] border overflow-hidden cursor-pointer flex flex-col shadow-[0px_1px_4px_0px_rgba(0,0,0,0.04),0px_4px_10px_0px_rgba(0,0,0,0.08)]"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <ImageFallback
          src={photoSrc}
          fallbackSrc={HOTEL_IMAGE_PLACEHOLDER}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#1f2937] line-clamp-1">
            {hotel.name}
          </h3>
          {!!hotel.star_rating && (
            <div className="flex items-center gap-0.5 shrink-0 text-amber-500">
              {Array.from({ length: hotel.star_rating }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
          )}
        </div>

        {hotel.address && (
          <p className="flex items-start gap-1 text-xs text-gray-500 mt-1 line-clamp-2">
            <MapPin size={12} className="shrink-0 mt-0.5" />
            {hotel.address}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
          {bestRate?.has_breakfast && (
            <span className="flex items-center gap-1">
              <UtensilsCrossed size={12} /> Breakfast
            </span>
          )}
          {hasFreeCancellation && (
            <span className="flex items-center gap-1 text-emerald-600">
              <ShieldCheck size={12} /> Free cancellation
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* <button
            onClick={(e) => handleNavigate(e, `/hotels/${hotel.id}`)}
            className="flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
          >
            Read More <ArrowRight size={16} className="ml-1" />
          </button> */}
          <span className="text-xs text-gray-500">Recommended</span>
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Switch
              checked={recommended}
              disabled={saving}
              onCheckedChange={handleToggleRecommended}
            />
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            {bestRate?.show_amount_per_night && (
              <>
                <p className="text-lg font-bold text-gray-900">
                  {Number(bestRate.show_amount_per_night).toLocaleString()}{" "}
                  <span className="text-xs font-normal text-gray-500">
                    {bestRate.show_currency_code} / night
                  </span>
                </p>
                <p className="text-[11px] text-gray-400">
                  Price for selected dates
                </p>
              </>
            )}
          </div>
          <button
            onClick={(e) => handleNavigate(e, `/hotels/${hotel.id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
