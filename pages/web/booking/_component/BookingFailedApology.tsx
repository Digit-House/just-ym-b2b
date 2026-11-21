import { useState } from "react";
import { toast } from "sonner";
import ButtonSpinner from "@/components/ButtonSpinner";
import { Button } from "@/components/ui/button";
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
import { sendBookingFailedApologyEmail } from "@/graphql/booking";
import { formatUtcDate } from "@/lib/dateFormat";
import { useUser } from "@/provider/UserProvider";
import { getErrMsg } from "@/util/initData";

type Props = {
  transactionId: string;
  isFailed: boolean;
  sentAt?: string | null;
  voucherCode?: string | null;
  onSent: (sentAt: string, voucherCode?: string | null) => void;
  className?: string;
};

/** OWNER-only: apology button on FAILED bookings, then the sent-at label. */
const BookingFailedApology = ({
  transactionId,
  isFailed,
  sentAt,
  voucherCode,
  onSent,
  className,
}: Props) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  if (user?.type !== "OWNER" || !isFailed) return null;

  const send = async () => {
    setLoading(true);
    try {
      const res: any = await sendBookingFailedApologyEmail(
        transactionId,
        code.trim().toUpperCase() || undefined
      );
      const out = res.data.sendBookingFailedApologyEmail;
      onSent(out.sentAt, out.voucherCode);
      toast.success("Apology email sent");
      setOpen(false);
    } catch (err) {
      toast.error(getErrMsg(err as any, "message"));
    } finally {
      setLoading(false);
    }
  };

  // stopPropagation: the dialog portal still bubbles clicks to the card link
  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      {sentAt ? (
        <span className="text-xs text-slate-500">
          Apology sent {formatUtcDate(sentAt)}
          {voucherCode ? ` · Voucher ${voucherCode}` : ""}
        </span>
      ) : (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
          >
            Send apology email
          </Button>
          <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send apology email?</DialogTitle>
                <DialogDescription>
                  The customer gets an email about this failed booking. It can
                  only be sent once.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-1">
                <Label htmlFor={`apology-voucher-${transactionId}`}>
                  Voucher code (optional)
                </Label>
                <Input
                  id={`apology-voucher-${transactionId}`}
                  value={code}
                  placeholder="50BAHTOFF-XXXX"
                  disabled={loading}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" disabled={loading} onClick={send}>
                  {loading ? <ButtonSpinner /> : "Send"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default BookingFailedApology;
