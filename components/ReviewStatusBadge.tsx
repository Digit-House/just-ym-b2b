import { ContentReviewStatus } from "@/types/contentEditor.type";

const LOOK: Record<string, { label: string; cls: string }> = {
  NOT_STARTED: { label: "Not started", cls: "bg-gray-100 text-gray-600" },
  IN_PROGRESS: { label: "In progress", cls: "bg-amber-100 text-amber-800" },
  SENT_BACK: { label: "Sent back", cls: "bg-amber-100 text-amber-800" },
  READY_FOR_REVIEW: { label: "Ready for review", cls: "bg-indigo-100 text-indigo-800" },
  DONE: { label: "Done", cls: "bg-green-100 text-green-800" },
};

export const REVIEW_STATUS_OPTIONS: { value: ContentReviewStatus; label: string }[] = [
  { value: "IN_PROGRESS", label: LOOK.IN_PROGRESS.label },
  { value: "SENT_BACK", label: LOOK.SENT_BACK.label },
  { value: "READY_FOR_REVIEW", label: LOOK.READY_FOR_REVIEW.label },
  { value: "DONE", label: LOOK.DONE.label },
];

/** Review status pill; null or undefined reads "Not started". */
const ReviewStatusBadge = ({ status }: { status?: ContentReviewStatus | null }) => {
  const l = LOOK[status ?? "NOT_STARTED"];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${l.cls}`}>{l.label}</span>;
};

export default ReviewStatusBadge;
