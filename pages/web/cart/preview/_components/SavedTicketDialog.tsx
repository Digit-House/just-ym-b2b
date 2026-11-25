import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ButtonSpinner from "@/components/ButtonSpinner";
import { fetchTicketBytes } from "./pdfHelpers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  bookingId?: string;
};

// Stored files have a generic content type, so a plain iframe would download them: show a PDF blob instead.
const SavedTicketDialog = ({ open, onOpenChange, url, bookingId }: Props) => {
  const [objUrl, setObjUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!open) return;
    let dead = false; // set on close, url, booking or retry: a late response is ignored
    let made: string | null = null;
    setObjUrl(null);
    setFailed(false);
    fetchTicketBytes(bookingId ?? "", url)
      .then((bytes) => {
        if (dead) return;
        made = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
        setObjUrl(made);
      })
      .catch(() => !dead && setFailed(true));
    return () => {
      dead = true;
      if (made) URL.revokeObjectURL(made);
    };
  }, [open, url, bookingId, attempt]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="inset-0 m-auto flex h-[94vh] w-[96vw] max-w-[96vw] translate-x-0 translate-y-0 flex-col sm:max-w-[min(96vw,1400px)]">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">Saved ticket</DialogTitle>
        </DialogHeader>
        {objUrl ? (
          <iframe
            src={`${objUrl}#navpanes=0&view=FitH`}
            title="Saved ticket"
            className="min-h-0 w-full flex-1 rounded border"
          />
        ) : failed ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-red-600">
            Could not load the saved ticket.
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setAttempt((n) => n + 1)}>
                Retry
              </Button>
              <a href={url} target="_blank" rel="noreferrer" className="text-gray-600 underline">
                Download file
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <ButtonSpinner />
          </div>
        )}
        <DialogFooter>
          {objUrl && (
            <Button variant="outline" asChild>
              <a href={objUrl} target="_blank" rel="noreferrer">
                Open in new tab
              </a>
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedTicketDialog;
