import { useState } from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

type Params = {
  onCommit: (checkin: string, checkout: string) => void;
};

// Shared by HotelSearchBar and AvailabilityBar. Keeps the range-picker fix in one place:
// react-day-picker's default range logic (addToRange), once a COMPLETE range is selected,
// has several edge cases that collapse or distort the range on the next click — e.g.
// re-clicking the current start or end date collapses to a single day (from === to), and
// clicking past the end just stretches it while leaving the old start in place. Every click
// after a complete range now restarts the selection fresh instead, which is also the
// convention most date-range pickers (Airbnb, Booking.com, trip.com) follow.
export function useDateRangeDraft({ onCommit }: Params) {
  const [draftRange, setDraftRange] = useState<DateRange>();

  const seedDraft = (checkin: Date, checkout: Date) => {
    setDraftRange({ from: checkin, to: checkout });
  };

  const clearDraft = () => setDraftRange(undefined);

  const handleSelect = (range: DateRange | undefined, clickedDay: Date) => {
    if (draftRange?.from && draftRange?.to) {
      setDraftRange({ from: clickedDay, to: undefined });
      return;
    }

    setDraftRange(range);

    if (range?.from && range?.to) {
      onCommit(format(range.from, "yyyy-MM-dd"), format(range.to, "yyyy-MM-dd"));
    }
  };

  return { draftRange, seedDraft, clearDraft, handleSelect };
}
