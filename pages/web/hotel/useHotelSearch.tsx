import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { HotelSearchState } from "@/types/hotel.type";
import {
  DEFAULT_HOTEL_RESIDENCY,
  DEFAULT_HOTEL_RESIDENCY_LABEL,
} from "@/graphql/hotel";

const STORAGE_KEY = "hotelSearchState";

const defaultCheckin = () => format(addDays(new Date(), 1), "yyyy-MM-dd");
const defaultCheckout = () => format(addDays(new Date(), 2), "yyyy-MM-dd");

const DEFAULT_SEARCH: HotelSearchState = {
  destinationLabel: "",
  regionId: null,
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
      return stored ? { ...DEFAULT_SEARCH, ...JSON.parse(stored) } : DEFAULT_SEARCH;
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
      checkin: s.checkin,
      checkout: s.checkout,
      guests: s.guests,
      residency: s.residency,
      residencyLabel: s.residencyLabel,
    }));
  };

  return { search, setSearch, resetFilters };
}
