import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { updateHotel } from "@/graphql/hotel";
import { getErrMsg } from "@/util/initData";

type Props = {
  hotelId: string;
  isRecommended?: boolean | null;
};

/** The hotel's "recommended" switch; clicks don't reach the card's navigation. */
const RecommendedToggle = ({ hotelId, isRecommended }: Props) => {
  const [recommended, setRecommended] = useState(!!isRecommended);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRecommended(!!isRecommended);
  }, [isRecommended]);

  // Optimistic toggle — flip immediately, revert if the mutation fails.
  const handleToggle = async (checked: boolean) => {
    setRecommended(checked);
    setSaving(true);
    try {
      await updateHotel({ id: hotelId, isRecommended: checked });
      toast.success(
        checked ? "Marked as recommended" : "Removed from recommended",
      );
    } catch (err: any) {
      setRecommended(!checked);
      toast.error(getErrMsg(err, "message"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Switch
        checked={recommended}
        disabled={saving}
        onCheckedChange={handleToggle}
      />
    </div>
  );
};

export default RecommendedToggle;
