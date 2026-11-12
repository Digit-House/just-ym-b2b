import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { HotelSearchState } from "@/types/hotel.type";
import {
  DEFAULT_HOTEL_RESIDENCY,
  DEFAULT_HOTEL_RESIDENCY_LABEL,
} from "@/graphql/hotel";

const STORAGE_KEY = "hotelSearchState";
const RESIDENCY_MIGRATION_KEY = "hotelResidencyDefaultMM";

const defaultCheckin = () => format(addDays(new Date(), 1), "yyyy-MM-dd");
const defaultCheckout = () => format(addDays(new Date(), 2), "yyyy-MM-dd");

const DEFAULT_SEARCH: HotelSearchState = {
  destinationLabel: "",
  regionId: null,
  selectedHotel: null,
  checkin: defaultCheckin(),
  checkout: defaultCheckout(),
  guests: [{ adults: 2, children: [] }],
  residency: DEFAULT_HOTEL_RESIDENCY,
  residencyLabel: DEFAULT_HOTEL_RESIDENCY_LABEL,
  starRating: [],
  mealType: [],
  freeCancellationOnly: false,
  priceFrom: undefined,
  priceTo: undefined,
  sort: "price_asc",
};

export function useHotelSearch() {
  const [search, setSearch] = useState<HotelSearchState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_SEARCH;
      const parsed: HotelSearchState = { ...DEFAULT_SEARCH, ...JSON.parse(stored) };
      // Searches saved before the default moved from Thailand to Myanmar still carry the old
      // default — move them over once; a nationality picked after this is kept as-is.
      if (!localStorage.getItem(RESIDENCY_MIGRATION_KEY)) {
        if (parsed.residency === "th") {
          parsed.residency = DEFAULT_HOTEL_RESIDENCY;
          parsed.residencyLabel = DEFAULT_HOTEL_RESIDENCY_LABEL;
        }
        localStorage.setItem(RESIDENCY_MIGRATION_KEY, "1");
      }
      // Dates persisted from an earlier day can't be searched — fall back to the defaults.
      if (parsed.checkin < format(new Date(), "yyyy-MM-dd")) {
        parsed.checkin = defaultCheckin();
        parsed.checkout = defaultCheckout();
      }
      return parsed;
    } catch {
      return DEFAULT_SEARCH;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(search));
  }, [search]);

  const resetFilters = () => {
    setSearch((s) => ({
      ...DEFAULT_SEARCH,
      destinationLabel: s.destinationLabel,
      regionId: s.regionId,
      selectedHotel: s.selectedHotel,
      checkin: s.checkin,
      checkout: s.checkout,
      guests: s.guests,
      residency: s.residency,
      residencyLabel: s.residencyLabel,
    }));
  };

  return { search, setSearch, resetFilters };
}
