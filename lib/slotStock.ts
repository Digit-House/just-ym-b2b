import { EVENT_AVAILABLE_DATA_TYPE } from "@/types/product.type";

export const LOW_SEATS = 10;

type Slot = Pick<EVENT_AVAILABLE_DATA_TYPE, "available" | "unlimited" | "isInactive">;

// The API sends available = null for slots without a limit (the server skips the stock check then).
const hasNoLimit = (s: Slot) => !!s.unlimited || s.available == null;

export const isSoldOut = (s: Slot) =>
  !!s.isInactive || (!hasNoLimit(s) && s.available <= 0);

// Seats left, or null when the slot has no limit.
export const seatsLeft = (s: Slot): number | null =>
  hasNoLimit(s) ? null : Math.max(0, s.available);

export const isLowStock = (s: Slot) => {
  const left = seatsLeft(s);
  return !isSoldOut(s) && left !== null && left <= LOW_SEATS;
};

// Most tickets any bookable slot can take.
// null when no slots are loaded or some slot is unlimited; 0 when every slot is sold out.
export const maxSlotCapacity = (slots: Slot[]): number | null => {
  if (slots.length === 0) return null;
  const open = slots.filter((s) => !isSoldOut(s));
  if (open.length === 0) return 0;
  if (open.some(hasNoLimit)) return null;
  return Math.max(...open.map((s) => s.available));
};