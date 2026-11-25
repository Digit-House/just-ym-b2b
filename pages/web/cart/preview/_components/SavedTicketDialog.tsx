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
import { fetchPdfBytes } from "./pdfHelpers";

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

  useEffect(() => {
    if (!open) return;
    let dead = false; // set on close, url or booking change: a late response is ignored
    let made: string | null = null;
    setObjUrl(null);
    setFailed(false);
    fetchPdfBytes(url)
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
  }, [open, url, bookingId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="inset-0 m-auto flex h-[90vh] w-[95vw] max-w-[95vw] translate-x-0 translate-y-0 flex-col sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">Saved ticket</DialogTitle>
        </DialogHeader>
        {objUrl ? (
          <iframe
            src={objUrl}
            title="Saved ticket"
            className="min-h-0 w-full flex-1 rounded border"
          />
        ) : failed ? (
          <div className="flex flex-1 items-center justify-center text-center text-sm text-red-600">
            Could not load the saved ticket. Use Open in new tab instead.
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <ButtonSpinner />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" asChild>
            <a href={objUrl ?? url} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedTicketDialog;
