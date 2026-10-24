import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  EtgHotelBookingOutputT,
  HotelBookingContactInfoT,
  HotelBookingGuestT,
  HotelBookingSelectionT,
} from "@/types/hotel.type";

interface HotelBookingState {
  selection: HotelBookingSelectionT | null;
  setSelection: (selection: HotelBookingSelectionT | null) => void;

  contactInfo: HotelBookingContactInfoT | null;
  setContactInfo: (info: HotelBookingContactInfoT) => void;

  guestNames: HotelBookingGuestT[][];
  setGuestNames: (guests: HotelBookingGuestT[][]) => void;

  specialRequests: string;
  setSpecialRequests: (value: string) => void;

  // The most recent successful createHotelReservation response — kept separate from the
  // draft fields above (and untouched by reset()) so the confirmation page survives a
  // refresh even after the draft that produced it is cleared.
  lastReservation: EtgHotelBookingOutputT | null;
  setLastReservation: (reservation: EtgHotelBookingOutputT | null) => void;

  reset: () => void;
}

export const useHotelBookingStore = create<HotelBookingState>()(
  persist(
    (set) => ({
      selection: null,
      setSelection: (selection) => set({ selection }),

      contactInfo: null,
      setContactInfo: (contactInfo) => set({ contactInfo }),

      guestNames: [],
      setGuestNames: (guestNames) => set({ guestNames }),

      specialRequests: "",
      setSpecialRequests: (specialRequests) => set({ specialRequests }),

      lastReservation: null,
      setLastReservation: (lastReservation) => set({ lastReservation }),

      reset: () =>
        set({
          selection: null,
          contactInfo: null,
          guestNames: [],
          specialRequests: "",
        }),
    }),
    {
      name: "hotel-booking-storage",
    }
  )
);
