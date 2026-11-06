import { useState } from "react";
import PreviewFormFrame from "@/pages/web/ticket/userInfo/_component.tsx/PreviewFormFrame";
import { CART_ICON_ENUM } from "@/types/product.type";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useHotelBookingStore } from "@/store/useHotelBookingStore";

const MAX_CHARS = 1000;

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDone: () => void;
};

const SpecialRequestsSection = ({ open, setOpen, onDone }: Props) => {
  const { specialRequests: stored, setSpecialRequests } =
    useHotelBookingStore();
  const [value, setValue] = useState(stored);

  return (
    <PreviewFormFrame
      title="Special Requests"
      iconName={CART_ICON_ENUM.TIME}
      open={open}
      setOpen={setOpen}
    >
      <div className="flex flex-col w-full gap-4 px-8 py-6">
        <p className="text-sm text-gray-500">
          Special requests cannot be guaranteed, but the property will do its
          best to meet your needs.
        </p>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm">Your Requests</p>
          <div className="relative">
            <Textarea
              placeholder="e.g. I'd like a high floor room with a city view, a baby cot, or early check-in if possible..."
              value={value}
              onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
              className="min-h-[120px] border-gray-200 resize-none pr-16"
            />
            <span className="absolute text-xs text-gray-400 pointer-events-none bottom-2 right-3">
              {value.length}/{MAX_CHARS}
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            size="lg"
            onClick={() => {
              setSpecialRequests(value);
              onDone();
            }}
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </PreviewFormFrame>
  );
};

export default SpecialRequestsSection;
