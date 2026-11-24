import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import MascotLoader from "@/components/MascotLoader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  approvePaymentReview,
  errorCode,
  getPaymentReviews,
  PaymentReviewReasonT,
  PaymentReviewStatusT,
  PaymentReviewT,
  rejectPaymentReview,
} from "@/graphql/bookingSecurity";

const STATUSES: PaymentReviewStatusT[] = ["PENDING", "APPROVED", "REJECTED"];

const REASONS: Record<PaymentReviewReasonT, string> = {
  NO_3DS: "Card was not verified with 3D Secure",
  RISK_ELEVATED: "Stripe rates this payment as elevated risk",
  RISK_HIGHEST: "Stripe rates this payment as highest risk",
  LOCKDOWN: "Lockdown: every customer booking needs approval",
};

const ErrorMessages: Record<string, string> = {
  SUPPLIER_CONFIRM_FAILED:
    "The supplier could not confirm this booking. It is still pending; try again later or reject it and refund in Stripe.",
  REVIEW_NOT_PENDING:
    "This review was already decided. The list has been refreshed.",
  PAYMENT_REFUNDED:
    "This payment was already refunded or disputed in Stripe. The booking was rejected; nothing was sent to the supplier.",
  STRIPE_READ_FAILED:
    "Could not check this payment with Stripe. It is still pending; try again in a minute.",
};

const PaymentReview = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<PaymentReviewStatusT>("PENDING");
  const [action, setAction] = useState<{ type: "approve" | "reject"; review: PaymentReviewT } | null>(null);
  const [busy, setBusy] = useState(false);
  const [refundUrl, setRefundUrl] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payment-reviews", status],
    queryFn: () => getPaymentReviews(status),
    retry: 1,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["payment-reviews"] });

  const run = async () => {
    if (!action) return;
    setBusy(true);
    try {
      if (action.type === "approve") {
        await approvePaymentReview(action.review.id);
        toast.success("Payment approved and booking confirmed.");
      } else {
        const res = await rejectPaymentReview(action.review.id);
        setRefundUrl(res.stripeDashboardUrl ?? action.review.stripeDashboardUrl);
        toast.success("Payment rejected.");
      }
      setAction(null);
      refresh();
    } catch (err) {
      const code = errorCode(err);
      toast.error(ErrorMessages[code] ?? (err instanceof Error ? err.message : "Action failed"));
      setAction(null);
      refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Payment review"
        des="Payments held for your approval before the booking is confirmed."
      />

      <div className="flex gap-2 mb-4">
        {STATUSES.map((s) => (
          <Button key={s} variant={s === status ? "default" : "outline"} onClick={() => setStatus(s)}>
            {s}
          </Button>
        ))}
      </div>

      {isLoading && <MascotLoader label="Loading payment reviews..." className="h-64" />}

      {isError && (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>
            Error loading payment reviews:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="flex justify-center items-center h-40 text-gray-500">
          <p>No {status.toLowerCase()} payment reviews.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Booking ref</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Stripe</TableHead>
                {status === "PENDING" && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{r.kind === "HOTEL" ? "Hotel" : "Ticket"}</TableCell>
                  <TableCell className="font-mono text-xs">{r.bookingRef}</TableCell>
                  <TableCell>{REASONS[r.reason] ?? r.reason}</TableCell>
                  <TableCell>
                    {r.amount != null ? `${r.amount.toLocaleString()} ${r.currency ?? ""}` : "-"}
                  </TableCell>
                  <TableCell>
                    {r.stripeDashboardUrl ? (
                      <a
                        href={r.stripeDashboardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline"
                      >
                        Open in Stripe
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  {status === "PENDING" && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setAction({ type: "approve", review: r })}>
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive-outline"
                          onClick={() => setAction({ type: "reject", review: r })}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!action} onOpenChange={(o) => !o && !busy && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action?.type === "approve" ? "Approve this payment?" : "Reject this payment?"}
            </DialogTitle>
            <DialogDescription>
              {action?.type === "approve"
                ? "The booking will be confirmed with the supplier now."
                : "The booking will not be confirmed. You must refund the customer in Stripe yourself."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={busy} onClick={() => setAction(null)}>
              Cancel
            </Button>
            <Button
              variant={action?.type === "reject" ? "destructive" : "default"}
              disabled={busy}
              onClick={run}
            >
              {busy ? "Working..." : action?.type === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!refundUrl} onOpenChange={(o) => !o && setRefundUrl(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund this payment in Stripe</DialogTitle>
            <DialogDescription>
              The payment was rejected. Nothing was refunded automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundUrl(null)}>
              Close
            </Button>
            {refundUrl && (
              <a href={refundUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline self-center">
                Refund this payment in Stripe
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default PaymentReview;
