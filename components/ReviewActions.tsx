import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReviewStatusBadge from "@/components/ReviewStatusBadge";
import { approveContentReview, errorCode, sendBackContentReview } from "@/graphql/contentEditorReview";
import { notifyReviewChanged } from "@/hooks/useReviewCount";
import { getErrMsg } from "@/util/initData";
import { ContentReviewStatus } from "@/types/contentEditor.type";

type Kind = "approve" | "sendBack";

const COPY: Record<Kind, { title: string; body: string; ok: string; done: string }> = {
  approve: {
    title: "Approve and publish?",
    body: "The ticket is marked Done and goes live to customers. Unsaved changes on this page are discarded.",
    ok: "Approve and publish",
    done: "Approved and published",
  },
  sendBack: {
    title: "Send back to the editor?",
    body: "The ticket returns to In progress so the editor can keep working. It is not published.",
    ok: "Send back",
    done: "Sent back to the editor",
  },
};

/** Owner: review status badge, plus Approve and publish / Send back while the ticket is READY_FOR_REVIEW (R6). */
const ReviewActions = ({
  productId,
  status,
  submittedAt,
  onApproved,
}: {
  productId: string;
  status?: ContentReviewStatus | null;
  submittedAt?: string | null;
  onApproved?: () => void;
}) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState<Kind | null>(null);

  const act = useMutation({
    mutationFn: (k: Kind) => (k === "approve" ? approveContentReview(productId) : sendBackContentReview(productId)),
    onSuccess: (_d, k) => {
      toast.success(COPY[k].done);
      ["productContent", "contentProducts", "contentReviewCounts", "auditLogs", "ticket"].forEach((key) =>
        qc.invalidateQueries({ queryKey: [key] })
      );
      notifyReviewChanged();
      if (k === "approve") onApproved?.();
    },
    onError: (err) => {
      toast.error(
        errorCode(err) === "REVIEW_NOT_PENDING"
          ? "This ticket is no longer waiting for review. Someone else may have already approved or sent it back."
          : getErrMsg(err as any, "message")
      );
      // The status shown is stale; reload it.
      ["productContent", "contentReviewCounts"].forEach((key) => qc.invalidateQueries({ queryKey: [key] }));
      notifyReviewChanged();
    },
    onSettled: () => setOpen(null),
  });

  const copy = open ? COPY[open] : null;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <ReviewStatusBadge status={status} />
      {status === "IN_PROGRESS" && submittedAt && <span className="text-sm text-amber-700">Sent back to editor</span>}
      {status === "READY_FOR_REVIEW" && (
        <>
          <Button type="button" disabled={act.isPending} onClick={() => setOpen("approve")}>
            Approve and publish
          </Button>
          <Button type="button" variant="outline" disabled={act.isPending} onClick={() => setOpen("sendBack")}>
            Send back
          </Button>
        </>
      )}
      <Dialog open={!!open} onOpenChange={(o) => !o && !act.isPending && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy?.title}</DialogTitle>
            <DialogDescription>{copy?.body}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={act.isPending} onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button type="button" disabled={act.isPending} onClick={() => open && act.mutate(open)}>
              {act.isPending ? "Working..." : copy?.ok}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewActions;
