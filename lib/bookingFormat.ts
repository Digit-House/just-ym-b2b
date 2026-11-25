import { BOOKING_STATUS_ENUM } from "@/types/booking.type";

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: "Awaiting payment",
  PAID: "Paid",
  FAILED: "Failed",
  EXPIRED: "Expired",
};

export const paymentStatusLabel = (s?: string | null) =>
  (s && PAYMENT_STATUS_LABEL[s]) || s || "";

export const getStatusStyles = (status: BOOKING_STATUS_ENUM | string) => {
  switch (status) {
    case BOOKING_STATUS_ENUM.PAID:
      return "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100";
    case BOOKING_STATUS_ENUM.PENDING:
      return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100";
    case BOOKING_STATUS_ENUM.FAILED:
      return "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200";
  }
};

// e.g. "THB 1,234.50"
export const formatPrice = (amount: number | string | null | undefined, currencyCode = "THB") => {
  const n = Number(amount);
  return `${currencyCode} ${(Number.isFinite(n) ? n : 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
