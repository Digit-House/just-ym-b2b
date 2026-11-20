import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContentReviewCounts } from "@/graphql/contentEditorReview";

const EVENT = "content-review-changed";

/** Call after submit, approve or send back so the sidebar count refreshes at once. */
export const notifyReviewChanged = () => window.dispatchEvent(new Event(EVENT));

/** Review counts (readyForReview, sentBack, inProgress). Polls every 60 s; 0 when disabled or on error. `loaded` is true once the first fetch settled (or when disabled). */
export const useReviewCount = (enabled: boolean) => {
  const { data, refetch, isFetched } = useQuery({
    queryKey: ["contentReviewCounts"],
    queryFn: getContentReviewCounts,
    enabled,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
  useEffect(() => {
    if (!enabled) return;
    const on = () => void refetch();
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, [enabled, refetch]);
  return {
    readyForReview: enabled ? data?.readyForReview ?? 0 : 0,
    sentBack: enabled ? data?.sentBack ?? 0 : 0,
    inProgress: enabled ? data?.inProgress ?? 0 : 0,
    loaded: !enabled || isFetched,
  };
};
