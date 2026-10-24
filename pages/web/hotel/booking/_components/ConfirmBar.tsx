import { StarsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  disabled: boolean;
  loading?: boolean;
  onConfirm: () => void;
};

const ConfirmBar = ({ disabled, loading, onConfirm }: Props) => {
  return (
    <div
      className="w-full bg-white border border-[#E2E8F080]/50 rounded-3xl overflow-hidden gap-5 px-8 py-6 flex flex-col"
      style={{ boxShadow: "0px 10px 15px -3px #0000001A" }}
    >
      <div className="flex items-start gap-4 p-4 rounded-[14px] border border-amber-200 bg-amber-50">
        <StarsIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          By confirming, you agree to our terms and conditions. You'll receive
          a confirmation email shortly.
        </p>
      </div>
      <Button
        size="lg"
        disabled={disabled || loading}
        onClick={onConfirm}
        className="w-full"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </Button>
    </div>
  );
};

export default ConfirmBar;
