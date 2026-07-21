import { CalendarClock, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { HotelGuestInput, HotelRoomRateT } from "@/types/hotel.type";

export type SelectedRateT = {
  rate: HotelRoomRateT;
  roomTypeName: string;
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
                <p className="text-sm font-medium text-gray-700 truncate">
                  {totalAdults} Adult{totalAdults !== 1 ? "s" : ""}
                  {totalChildren > 0 &&
                    `, ${totalChildren} Child(${totalChildren !== 1 ? "ren" : ""})`}
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

        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <p className="font-semibold text-gray-900">Total Payment</p>
          <p className="font-bold text-gray-900">
            {payment?.show_amount
              ? `${payment.show_currency_code} ${Number(payment.show_amount).toLocaleString()}`
              : "—"}
          </p>
        </div>
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
