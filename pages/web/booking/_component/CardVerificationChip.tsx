import { cn } from "@/lib/utils";
import { formatUtcDate } from "@/lib/dateFormat";
import {
  CardVerificationFailureReason,
  CardVerificationOwnerViewT,
} from "@/types/booking.type";

export const FAILURE_REASON_TEXT: Record<CardVerificationFailureReason, string> = {
  DIFFERENT_CARD: "A different card was used",
  NO_CODE: "The bank did not ask for a code",
  NOT_AUTHENTICATED: "The bank code was not accepted",
  NOT_COMPLETED: "The check was not completed",
};

const reasonText = (r?: CardVerificationFailureReason | null) =>
  (r && FAILURE_REASON_TEXT[r]) || "Could not confirm the card";

/** OWNER-only chip showing the card-check result of a booking. */
const CardVerificationChip = ({
  cv,
  className,
}: {
  cv?: CardVerificationOwnerViewT | null;
  className?: string;
}) => {
  if (!cv) return null;
  const tries = `${cv.attemptsUsed}/${cv.maxAttempts}`;
  const date = (d?: string | null) => (d ? formatUtcDate(d, "dd MMM yyyy") : "");

  let label: string;
  let tone: string;
  let title: string;
  switch (cv.status) {
    case "SENT":
      label = `Card check sent · expires ${date(cv.expiresAt)} · tries ${tries}`;
      tone = "bg-blue-50 text-blue-700 border-blue-100";
      title = `Sent ${formatUtcDate(cv.sentAt ?? "")} (${cv.sendCount}x). Expires ${formatUtcDate(cv.expiresAt ?? "")}. Tries used ${tries}.${cv.lastFailureReason ? ` Last try: ${reasonText(cv.lastFailureReason)}.` : ""}`;
      break;
    case "VERIFIED":
      label = `Card verified · ${date(cv.verifiedAt)}`;
      tone = "bg-emerald-50 text-emerald-700 border-emerald-100";
      title = `Verified ${formatUtcDate(cv.verifiedAt ?? "")} after ${cv.attemptsUsed} tr${cv.attemptsUsed === 1 ? "y" : "ies"}.`;
      break;
    case "FAILED":
      label = `Not verified · ${reasonText(cv.lastFailureReason)}`;
      tone = "bg-rose-50 text-rose-700 border-rose-100";
      title = `All ${cv.maxAttempts} tries used${cv.failedAt ? ` (${formatUtcDate(cv.failedAt)})` : ""}. Last try: ${reasonText(cv.lastFailureReason)}.`;
      break;
    default:
      label = "Card check expired";
      tone = "bg-orange-50 text-orange-700 border-orange-100";
      title = `Link expired ${formatUtcDate(cv.expiresAt ?? "")}. Tries used ${tries}. You can resend.`;
  }

  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
};

export default CardVerificationChip;
