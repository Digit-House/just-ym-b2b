import { CheckCircle2, ImageIcon, UtensilsCrossed } from "lucide-react";
import { isAfter, parseISO } from "date-fns";
import ImageFallback from "@/components/ImageFallback";
import {
  filterValidHotelImages,
  resolveHotelImageUrl,
  HOTEL_IMAGE_PLACEHOLDER,
} from "@/graphql/hotel";
import { HotelRoomRateT, HotelRoomTypeT } from "@/types/hotel.type";

type Props = {
  roomType: HotelRoomTypeT;
  selectedBookHash?: string;
  onSelect: (rate: HotelRoomRateT, roomTypeName: string) => void;
};

const formatSlugLabel = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getRoomInfoLabel = (rate: HotelRoomRateT) =>
  rate.room_data_trans?.bedding_type
    ? formatSlugLabel(rate.room_data_trans.bedding_type)
    : (rate.room_data_trans?.main_name ?? rate.room_name);

const getCancellationLabel = (rate: HotelRoomRateT) => {
  const before =
    rate.payment_types?.[0]?.cancellation_penalties?.free_cancellation_before;
  if (!before) return { label: "Non-refundable", free: false };
  try {
    if (isAfter(parseISO(before), new Date())) {
      return {
        label: `Free cancellation until ${parseISO(before).toLocaleDateString()}`,
        free: true,
      };
    }
  } catch {
    // fall through to non-refundable if the date can't be parsed
  }
  return { label: "Non-refundable", free: false };
};

const RoomTypeCard = ({ roomType, selectedBookHash, onSelect }: Props) => {
  const validImages = filterValidHotelImages(roomType.images);
  const thumbnail = validImages.length
    ? resolveHotelImageUrl(validImages[0], "640x400")
    : HOTEL_IMAGE_PLACEHOLDER;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 p-5 border-b border-gray-100">
        <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0">
          <ImageFallback
            src={thumbnail}
            fallbackSrc={HOTEL_IMAGE_PLACEHOLDER}
            alt={roomType.name}
            className="w-full h-full object-cover"
          />
          {!!validImages.length && (
            <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-medium px-2 py-1 rounded">
              <ImageIcon size={10} />
              {validImages.length} photo
              {validImages.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900">{roomType.name}</p>
          {!!roomType.room_amenities.length && (
            <div className="flex flex-wrap gap-2 mt-2">
              {roomType.room_amenities.map((a) => (
                <span
                  key={a}
                  className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-md"
                >
                  {formatSlugLabel(a)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto px-5 pb-5">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-600 text-white text-xs uppercase tracking-wide">
                <th className="text-left font-semibold px-4 py-2.5">
                  Room Info
                </th>
                <th className="text-left font-semibold px-4 py-2.5">Meals</th>
                <th className="text-left font-semibold px-4 py-2.5">
                  Cancellation
                </th>
                <th className="text-left font-semibold px-4 py-2.5">
                  Net Price
                </th>
                <th className="text-left font-semibold px-4 py-2.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {roomType.rates.map((rate) => {
                const payment = rate.payment_types?.[0];
                const cancellation = getCancellationLabel(rate);
                const isSmoking = !rate.amenities_data?.includes(
                  "non-smoking"
                );
                const isSelected = selectedBookHash === rate.book_hash;

                return (
                  <tr
                    key={rate.book_hash}
                    className={`border-t border-gray-200 ${isSelected ? "bg-indigo-50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">
                        {getRoomInfoLabel(rate)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {isSmoking ? "Smoking allowed" : "Non-smoking"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {rate.meal_data?.has_breakfast ? (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                          <UtensilsCrossed size={12} /> Breakfast included
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Meals are not included
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${cancellation.free ? "text-emerald-600" : "text-gray-400"}`}
                      >
                        {cancellation.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {payment?.show_amount ? (
                        <p className="font-bold text-gray-900">
                          {payment.show_currency_code}{" "}
                          {Number(payment.show_amount).toLocaleString()}
                        </p>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onSelect(rate, roomType.name)}
                        disabled={!payment?.show_amount}
                        className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-200 text-gray-700 hover:border-indigo-400"
                        }`}
                      >
                        {isSelected && <CheckCircle2 size={14} />}
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomTypeCard;
