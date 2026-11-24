import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  BookingSecurityLevelT,
  BookingSecurityStatusT,
  getBookingSecurityStatus,
  setBookingSecurityLevel,
} from "@/graphql/bookingSecurity";

const QUERY_KEY = ["booking-security-status"];

const LEVELS: { level: BookingSecurityLevelT; effect: string; confirm: string }[] = [
  {
    level: "NORMAL",
    effect: "Customers book as usual. Card payments are checked for 3D Secure.",
    confirm: "Bookings return to normal checks.",
  },
  {
    level: "HIGH",
    effect: "Card payments that look risky are held for your review.",
    confirm: "Payments with elevated or highest Stripe risk will wait for your approval.",
  },
  {
    level: "LOCKDOWN",
    effect: "Every customer booking waits for your approval before it is confirmed.",
    confirm: "Every customer booking will wait for your approval.",
  },
  {
    level: "PAUSED",
    effect: "Customers cannot book. Resellers and owners can still book.",
    confirm: "Customers cannot book at all until you change the level.",
  },
];

const suggestionReason = (s: BookingSecurityStatusT) => {
  const w = s.warnings;
  const parts: string[] = [];
  if (w.failed24h > 0) parts.push(`${w.failed24h} failed payment check(s) in the last 24 hours`);
  if (w.fraudSignals7d > 0) parts.push(`${w.fraudSignals7d} fraud warning(s) or dispute(s) in the last 7 days`);
  if (parts.length === 0 && w.failed7d > 0) parts.push(`${w.failed7d} failed payment check(s) in the last 7 days`);
  if (parts.length === 0) parts.push("no recent failed checks or fraud signals");
  return parts.join(" and ");
};

const BookingSecurity = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getBookingSecurityStatus,
    retry: 1,
  });
  const [target, setTarget] = useState<(typeof LEVELS)[number] | null>(null);

  const mutation = useMutation({
    mutationFn: (level: BookingSecurityLevelT) => setBookingSecurityLevel(level),
    onSuccess: (res) => {
      queryClient.setQueryData(QUERY_KEY, res);
      toast.success(`Booking security level is now ${res.level}.`);
      setTarget(null);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to change the level");
    },
  });

  return (
    <PageContainer>
      <PageHeader
        title="Booking security"
        des="Control how strictly customer bookings and payments are checked."
      />

      {isLoading && <MascotLoader label="Loading booking security..." className="h-64" />}

      {isError && (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>
            Error loading booking security:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Current level</p>
            <p className="text-2xl font-bold text-gray-900">{data.level}</p>
            <p className="text-xs text-gray-500 mt-1">
              {data.updatedAt
                ? `Changed ${new Date(data.updatedAt).toLocaleString()}${data.updatedBy ? ` by user ${data.updatedBy}` : ""}`
                : "Never changed (default)"}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <p className="font-semibold text-amber-900 mb-2">Warnings</p>
            <ul className="text-sm text-amber-900 space-y-1">
              <li>Failed payment checks, last 24 hours: {data.warnings.failed24h}</li>
              <li>Failed payment checks, last 7 days: {data.warnings.failed7d}</li>
              <li>Fraud warnings and disputes, last 7 days: {data.warnings.fraudSignals7d}</li>
            </ul>
            {data.warnings.byReason24h.length > 0 && (
              <div className="mt-3 text-sm text-amber-900">
                <p className="font-medium">Failed checks in the last 24 hours by reason</p>
                <ul className="list-disc ml-5">
                  {data.warnings.byReason24h.map((r) => (
                    <li key={r.reason}>
                      {r.reason}: {r.count}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.suggestedLevel !== data.level && (
              <p className="mt-4 text-sm font-semibold text-amber-900">
                Suggested: {data.suggestedLevel}{" "}
                <span className="font-normal">({suggestionReason(data)})</span>
              </p>
            )}
          </div>

          <div className="grid gap-3">
            {LEVELS.map((l) => {
              const current = l.level === data.level;
              return (
                <div
                  key={l.level}
                  className={`bg-white rounded-2xl border p-4 flex items-center justify-between gap-4 ${current ? "border-indigo-500" : "border-gray-100"}`}
                >
                  <div>
                    <p className="font-semibold text-gray-900">{l.level}</p>
                    <p className="text-sm text-gray-600">{l.effect}</p>
                  </div>
                  {current ? (
                    <span className="text-sm text-indigo-600 font-medium">Current</span>
                  ) : (
                    <Button
                      variant={l.level === "PAUSED" || l.level === "LOCKDOWN" ? "destructive" : "outline"}
                      onClick={() => setTarget(l)}
                    >
                      Switch to {l.level}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={!!target} onOpenChange={(o) => !o && !mutation.isPending && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch to {target?.level}?</DialogTitle>
            <DialogDescription>{target?.confirm}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={mutation.isPending} onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={mutation.isPending}
              onClick={() => target && mutation.mutate(target.level)}
            >
              {mutation.isPending ? "Switching..." : `Switch to ${target?.level}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default BookingSecurity;
