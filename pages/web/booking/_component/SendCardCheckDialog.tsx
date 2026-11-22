import { useEffect, useState } from "react";
import { toast } from "sonner";
import ButtonSpinner from "@/components/ButtonSpinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendCardVerification } from "@/graphql/booking";
import { CardVerificationSendResultT } from "@/types/booking.type";
import { getErrMsg } from "@/util/initData";

export type CardCheckTarget = { id: string; reference: string };

const CODE_TEXT: Record<CardVerificationSendResultT["code"], string> = {
  SENT: "Email sent",
  ALREADY_VERIFIED: "Already verified, nothing sent",
  ATTEMPTS_USED: "All tries used, cannot resend",
  NOT_PAID: "Not paid, nothing sent",
  NOT_CARD_PAYMENT: "Not paid by card, nothing sent",
  NO_FINGERPRINT: "Original card could not be read, nothing sent",
  NOT_FOUND: "Booking not found",
  EMAIL_FAILED: "The email could not be delivered",
  TEST_ONLY: "Not sent: live sending is off. Use test mode.",
};

const TEST_EMAIL = "heinthantx@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  targets: CardCheckTarget[];
  open: boolean;
  onClose: () => void;
  onDone: () => void;
};

/** OWNER-only confirm dialog for sendCardVerification, with a per-booking result list. */
const SendCardCheckDialog = ({ targets, open, onClose, onDone }: Props) => {
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState(true);
  const [email, setEmail] = useState(TEST_EMAIL);
  const [results, setResults] = useState<CardVerificationSendResultT[] | null>(null);

  useEffect(() => {
    if (open) {
      setResults(null);
      setTest(true);
      setEmail(TEST_EMAIL);
    }
  }, [open]);

  const emailInvalid = test && !EMAIL_RE.test(email.trim());
  const refOf = (id: string) => targets.find((t) => t.id === id)?.reference ?? id;

  const send = async () => {
    setLoading(true);
    try {
      const out = await sendCardVerification(
        targets.map((t) => t.id),
        test ? email.trim() : undefined,
      );
      setResults(out);
      const ok = out.filter((r) => r.ok).length;
      const msg = `${ok} sent, ${out.length - ok} not sent`;
      if (ok === out.length) toast.success(msg);
      else if (ok === 0) toast.error(msg);
      else toast.warning(msg);
      onDone();
    } catch (err) {
      toast.error(getErrMsg(err as any, "message"));
    } finally {
      setLoading(false);
    }
  };

  const n = targets.length;
  // stopPropagation: the dialog portal still bubbles clicks to the card link
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={(v) => !loading && !v && onClose()}>
        {/* [translate:none]: the shared dialog centers with both transform and translate here, which double-shifts it */}
        <DialogContent className="[translate:none]">
          <DialogHeader>
            <DialogTitle>
              {results ? "Card check results" : `Send card check to ${n} booking${n === 1 ? "" : "s"}?`}
            </DialogTitle>
            <DialogDescription>
              {results
                ? "Result for each booking."
                : "Each customer gets an email with a secure link to confirm the card they paid with. The link works for 7 days and allows 5 tries. We do not charge the card. Resending replaces the old link."}
            </DialogDescription>
          </DialogHeader>

          {results ? (
            <ul className="max-h-64 space-y-1 overflow-y-auto text-sm">
              {results.map((r) => (
                <li key={r.transactionId} className="flex items-start gap-2">
                  <span className={r.ok ? "text-emerald-600" : "text-rose-600"}>
                    {r.ok ? "OK" : "Failed"}
                  </span>
                  <span className="font-mono text-xs pt-0.5">{refOf(r.transactionId)}</span>
                  <span className="text-slate-600">{CODE_TEXT[r.code] ?? r.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="cardcheck-test"
                  checked={test}
                  disabled={loading}
                  onCheckedChange={(v) => setTest(v === true)}
                />
                <Label htmlFor="cardcheck-test">Test mode: send only to this email</Label>
              </div>
              {test && (
                <div className="space-y-1">
                  <Input
                    type="email"
                    value={email}
                    placeholder="you@example.com"
                    disabled={loading}
                    aria-invalid={emailInvalid}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailInvalid && email && (
                    <p className="text-xs text-rose-600">Enter a valid email address.</p>
                  )}
                  <p className="text-xs text-slate-500">The customers get nothing in test mode.</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {results ? (
              <Button type="button" onClick={onClose}>Close</Button>
            ) : (
              <>
                <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="button" disabled={loading || emailInvalid || !n} onClick={send}>
                  {loading ? <ButtonSpinner /> : "Send"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendCardCheckDialog;
