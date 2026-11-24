import { cn } from "@/lib/utils";

type ManualFlags = {
  isManualHeld?: boolean | null;
  requiresManualConfirm?: boolean | null;
  isTicketConfirmed?: boolean | null;
  eTicketUrl?: string | null;
};

const chip = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold";
const AMBER = "bg-amber-50 text-amber-700 border-amber-200";

// OWNER-only: callers gate on user?.type === "OWNER".
export const manualStep = (b: ManualFlags) => {
  if (b.isTicketConfirmed) return "Confirmed";
  if (!b.requiresManualConfirm && !b.isManualHeld) return null;
  if (b.isManualHeld && !b.eTicketUrl) return "Needs ticket upload";
  if (b.eTicketUrl) return "Ready to confirm";
  return "Waiting for GlobalTix ticket";
};

export const ManualBookingChips = ({ booking }: { booking: ManualFlags }) => {
  const step = manualStep(booking);
  return (
    <>
      {booking.isManualHeld && <span className={cn(chip, AMBER)}>Manual booking</span>}
      {step && (
        <span className={cn(chip, step === "Confirmed" ? "bg-blue-50 text-blue-700 border-blue-200" : AMBER)}>
          {step}
        </span>
      )}
    </>
  );
};
