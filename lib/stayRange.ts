import { differenceInCalendarDays, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";

// Pure stay-range logic, copied from just-ym-hotel-ticket/src/lib/stayRange.ts
// (minus the locale date formatter) so the b2b picker behaves like the client site.

/** Longest stay the picker accepts; the room search is limited to this. */
export const MAX_STAY_NIGHTS = 30;

/**
 * Next check-in/check-out range after a click on `day`: the first click sets
 * check-in, the second sets check-out. Clicking again once both are set starts
 * a new stay, and a click on or before check-in moves check-in instead of
 * making a 0-night or backwards stay.
 */
export const nextStayRange = (
  current: DateRange | undefined,
  day: Date,
): DateRange => {
  const clicked = startOfDay(day);
  const from = current?.from ? startOfDay(current.from) : undefined;
  if (!from || current?.to) return { from: clicked, to: undefined };
  if (clicked <= from) return { from: clicked, to: undefined };
  return { from, to: clicked };
};

/** Whole nights between two dates. */
export const nightsBetween = (from: Date, to: Date) =>
  differenceInCalendarDays(to, from);

export type StayPick =
  | { kind: "ok" | "moved"; range: DateRange }
  | { kind: "tooLong" };

/**
 * A click on `day` in the stay picker: `nextStayRange`, except a check-out
 * more than MAX_STAY_NIGHTS after check-in is refused (`tooLong`) and a click
 * before check-in says check-in `moved`.
 */
export const pickStayDay = (
  current: DateRange | undefined,
  day: Date,
): StayPick => {
  const picking = !!current?.from && !current.to;
  const n = picking && current?.from ? nightsBetween(current.from, day) : 0;
  if (n > MAX_STAY_NIGHTS) return { kind: "tooLong" };
  return {
    kind: picking && n < 0 ? "moved" : "ok",
    range: nextStayRange(current, day),
  };
};

export type StayHint =
  | { kind: "nights"; nights: number }
  | { kind: "max" }
  | { kind: "checkIn" };

/** Tooltip for the day under the pointer or keyboard focus, or null. */
export const stayHint = (
  current: DateRange | undefined,
  hover: Date,
): StayHint | null => {
  if (!current?.from || current.to) return { kind: "checkIn" };
  const n = nightsBetween(current.from, hover);
  if (n === 0) return null;
  if (n < 0) return { kind: "checkIn" };
  return n > MAX_STAY_NIGHTS ? { kind: "max" } : { kind: "nights", nights: n };
};

/** Nights for the badge: null with no check-in, 0 until check-out. */
export const stayNights = (range: DateRange | undefined) =>
  range?.from ? (range.to ? nightsBetween(range.from, range.to) : 0) : null;
