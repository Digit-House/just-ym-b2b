import {
  BedDouble,
  CalendarClock,
  Info,
  ShieldCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { HotelGuestInput, HotelRoomRateT } from "@/types/hotel.type";
import { useUser } from "@/provider/UserProvider";
import { stayNights } from "@/lib/hotelPriceBreakdown";
import { formatEtgUtc } from "@/lib/etgTime";
import PriceBreakdown from "../../_components/PriceBreakdown";

export type SelectedRateT = {
  rate: HotelRoomRateT;
  roomTypeName: string;
};

const slugLabel = (slug: string) =>
  slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// No meal data -> no line (never guess "room only").
const mealLabel = (meal: HotelRoomRateT["meal_data"]) => {
  if (!meal) return null;
  if (meal.has_breakfast) return "Breakfast included";
  if (!meal.value || meal.value === "nomeal") return "Room only";
  return slugLabel(meal.value);
};

const bedLabel = (rate: HotelRoomRateT) => {
  const beds = rate.room_data_trans?.beds;
  if (beds?.length) {
    return beds
      .map((b) => `${b.count} ${b.bed.replace(/[-_]/g, " ")} bed${b.count > 1 ? "s" : ""}`)
      .join(", ");
  }
  const type = rate.room_data_trans?.bedding_type;
  return type ? slugLabel(type) : null;
};

type Props = {
  selectedRate: SelectedRateT | null;
  checkin: string;
  checkout: string;
  checkInTime?: string;
  checkOutTime?: string;
  guests: HotelGuestInput[];
  onEditRoom: () => void;
  onEditDates: () => void;
  onProceed: () => void;
};

const BookingSidebar = ({
  selectedRate,
  checkin,
  checkout,
  checkInTime,
  checkOutTime,
  guests,
  onEditRoom,
  onEditDates,
  onProceed,
}: Props) => {
  const totalAdults = guests.reduce((s, r) => s + r.adults, 0);
  const totalChildren = guests.reduce((s, r) => s + r.children.length, 0);
  const payment = selectedRate?.rate.payment_types?.[0];
  const isSmoking = !selectedRate?.rate.amenities_data?.includes("non-smoking");
  const { user } = useUser();
  const nights = stayNights(checkin, checkout);
  const rooms = Math.max(1, guests.length);
  const meal = selectedRate ? mealLabel(selectedRate.rate.meal_data) : null;
  const bed = selectedRate ? bedLabel(selectedRate.rate) : null;
  // UTC "Z" timestamp, shown in UTC like ETG sets it. Past or missing = non-refundable.
  const freeUntil = payment?.cancellation_penalties?.free_cancellation_before;
  const freeCancel =
    freeUntil && isAfter(parseISO(freeUntil), new Date())
      ? formatEtgUtc(freeUntil)
      : null;

  return (
    <div className="w-full lg:w-[340px] shrink-0 sticky top-20 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">
      <p className="font-bold text-gray-900">Your booking details</p>

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {selectedRate
                ? (selectedRate.rate.room_data_trans?.main_name ??
                  selectedRate.roomTypeName)
                : "No room selected"}
            </p>
            {selectedRate && (
              <p className="text-xs text-gray-400 mt-0.5">
                {isSmoking ? "Smoking allowed" : "Non-smoking"}
              </p>
            )}
            {meal && (
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                <UtensilsCrossed size={14} className="text-gray-400 shrink-0" />
                {meal}
              </p>
            )}
            {bed && (
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                <BedDouble size={14} className="text-gray-400 shrink-0" />
                {bed}
              </p>
            )}
          </div>
          {/* {selectedRate && (
            <button
              onClick={onEditRoom}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0"
            >
              Edit
            </button>
          )} */}
        </div>

        <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <CalendarClock
                size={16}
                className="text-indigo-600 mt-0.5 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Check-in
                </p>
                <p className="text-sm font-medium text-gray-700 truncate">
                  {format(parseISO(checkin), "EEE, d MMM yyyy")}
                  {checkInTime ? ` · ${checkInTime}` : ""}
                </p>
              </div>
            </div>
            {/* <button
              onClick={onEditDates}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0"
            >
              Edit
            </button> */}
          </div>

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <CalendarClock
                size={16}
                className="text-indigo-600 mt-0.5 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Check-out
                </p>
                <p className="text-sm font-medium text-gray-700 truncate">
                  {format(parseISO(checkout), "EEE, d MMM yyyy")}
                  {checkOutTime ? ` · ${checkOutTime}` : ""}
                </p>
              </div>
            </div>
            {/* <button
              onClick={onEditDates}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0"
            >
              Edit
            </button> */}
          </div>

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <Users size={16} className="text-indigo-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Guest
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {totalAdults} Adult{totalAdults !== 1 ? "s" : ""}
                  {totalChildren > 0 &&
                    `, ${totalChildren} ${totalChildren !== 1 ? "Children" : "Child"}`}
                  {` · ${rooms} Room${rooms !== 1 ? "s" : ""} · ${nights} night${nights !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            {/* <button
              onClick={onEditDates}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0"
            >
              Edit
            </button> */}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <PriceBreakdown
            payment={payment}
            nights={nights}
            rooms={rooms}
            isOwner={user?.type === "OWNER"}
          />
        </div>

        {selectedRate && (
          <ul className="border-t border-gray-100 pt-4 flex flex-col gap-2.5 text-sm">
            <li
              className={`flex items-start gap-2 ${freeCancel ? "text-green-600" : "text-red-600"}`}
            >
              <ShieldCheck size={16} className="mt-0.5 shrink-0" />
              <span>
                {freeCancel
                  ? `Free cancellation until ${freeCancel}`
                  : "Non-refundable"}
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-500">
              <Info size={16} className="mt-0.5 shrink-0" />
              <span>No booking fee. Price confirmed before payment.</span>
            </li>
          </ul>
        )}
      </div>

      <Button
        size="lg"
        disabled={!selectedRate}
        onClick={onProceed}
        className="w-full gap-2"
      >
        Proceed to Reservation →
      </Button>
    </div>
  );
};

export default BookingSidebar;
