import { differenceInCalendarDays, parseISO } from "date-fns";

// Display-only price breakdown (docs/specs/hotel-payment-breakdown.md). Never recomputes
// the charged total: `total` is the API's show_amount and is passed through unchanged.

export type HotelTaxItem = {
  name: string;
  included_by_supplier: boolean;
  amount: string;
  currency_code: string;
};

export type HotelPriceBreakdown = {
  nights: number;
  rooms: number;
  avgPerNight: number;
  /** Hotel (walk-in) price; null unless above the total. */
  barAmount: number | null;
  saving: number | null;
  savingPercent: number | null;
  includedTaxes: HotelTaxItem[];
  payAtHotelTaxes: HotelTaxItem[];
};

export const stayNights = (checkin: string, checkout: string) =>
  Math.max(1, differenceInCalendarDays(parseISO(checkout), parseISO(checkin)) || 1);

export const getPriceBreakdown = (opts: {
  total: number;
  bar?: number | string | null;
  nights: number;
  rooms: number;
  taxes?: HotelTaxItem[] | null;
}): HotelPriceBreakdown => {
  const nights = opts.nights >= 1 ? opts.nights : 1;
  const rooms = opts.rooms >= 1 ? opts.rooms : 1;
  const bar = Number(opts.bar);
  const barAmount = Number.isFinite(bar) && bar > opts.total ? bar : null;
  const saving = barAmount === null ? null : barAmount - opts.total;
  // A tax with no positive amount is hidden, never shown as 0.
  const taxes = (opts.taxes ?? []).filter((t) => Number(t.amount) > 0);
  return {
    nights,
    rooms,
    avgPerNight: Math.ceil(opts.total / (nights * rooms)),
    barAmount,
    saving,
    savingPercent:
      barAmount === null || saving === null
        ? null
        : Math.round((saving / barAmount) * 100),
    includedTaxes: taxes.filter((t) => t.included_by_supplier),
    payAtHotelTaxes: taxes.filter((t) => !t.included_by_supplier),
  };
};
