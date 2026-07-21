import { useEffect, useState } from "react";
import { HotelGuestInput } from "@/types/hotel.type";

export type DraftRoom = {
  adults: number;
  childAges: (number | null)[];
};

const toDraftRooms = (guests: HotelGuestInput[]): DraftRoom[] =>
  guests.map((g) => ({ adults: g.adults, childAges: [...g.children] }));

type Params = {
  guests: HotelGuestInput[];
  open: boolean; // draft resets to the committed guests each time the popover opens
  onCommit: (guests: HotelGuestInput[]) => void;
};

// Shared by HotelSearchBar and AvailabilityBar.
export function useGuestsDraft({ guests, open, onCommit }: Params) {
  const [draftRooms, setDraftRooms] = useState<DraftRoom[]>(() =>
    toDraftRooms(guests)
  );

  useEffect(() => {
    if (open) setDraftRooms(toDraftRooms(guests));
  }, [open]);

  const updateRoomAdults = (index: number, delta: number) => {
    setDraftRooms((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, adults: Math.max(1, r.adults + delta) } : r
      )
    );
  };

  const setRoomChildrenCount = (index: number, count: number) => {
    setDraftRooms((prev) =>
      prev.map((r, i) => {
        if (i !== index) return r;
        const ages = r.childAges;
        const nextAges =
          count > ages.length
            ? [...ages, ...Array(count - ages.length).fill(null)]
            : ages.slice(0, count);
        return { ...r, childAges: nextAges };
      })
    );
  };

  const setChildAge = (roomIndex: number, childIndex: number, age: number) => {
    setDraftRooms((prev) =>
      prev.map((r, i) => {
        if (i !== roomIndex) return r;
        const next = [...r.childAges];
        next[childIndex] = age;
        return { ...r, childAges: next };
      })
    );
  };

  const addRoom = () => {
    setDraftRooms((prev) => [...prev, { adults: 1, childAges: [] }]);
  };

  const removeRoom = (index: number) => {
    setDraftRooms((prev) => prev.filter((_, i) => i !== index));
  };

  const hasAllChildAges = draftRooms.every((r) =>
    r.childAges.every((age) => age !== null)
  );

  const commit = () => {
    if (!hasAllChildAges) return;
    onCommit(
      draftRooms.map((r) => ({
        adults: r.adults,
        children: r.childAges as number[],
      }))
    );
  };

  return {
    draftRooms,
    updateRoomAdults,
    setRoomChildrenCount,
    setChildAge,
    addRoom,
    removeRoom,
    hasAllChildAges,
    commit,
  };
}
