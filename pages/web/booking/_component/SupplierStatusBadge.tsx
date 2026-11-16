import { cn } from "@/lib/utils";

const GREEN = new Set(["BOOKED", "CONFIRMED"]);
const AMBER = new Set(["BOOKING_PENDING", "RESERVED", "PROCESSING"]);

// BOOKING_PENDING -> "Booking pending"
export const formatSupplierStatus = (s: string) => {
  const t = s.replace(/_/g, " ").toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const supplierStatusStyles = (s: string) => {
  const k = s.toUpperCase();
  if (GREEN.has(k)) return "bg-green-50 text-green-700 border-green-200";
  if (AMBER.has(k)) return "bg-amber-50 text-amber-700 border-amber-200";
  if (k === "FAILED") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
};

// OWNER-only: callers gate on user?.type === "OWNER"; hidden when status is empty.
const SupplierStatusBadge = ({
  status,
  prefix = "Supplier:",
  className,
}: {
  status?: string | null;
  prefix?: string;
  className?: string;
}) => {
  if (!status) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        supplierStatusStyles(status),
        className,
      )}
    >
      {prefix} {formatSupplierStatus(status)}
    </span>
  );
};

export default SupplierStatusBadge;
