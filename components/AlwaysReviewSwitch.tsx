import { Switch } from "@/components/ui/switch";

/** "Always review" toggle shown beside a content field label. */
const AlwaysReviewSwitch = ({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (on: boolean) => void;
}) => (
  <label
    className="flex cursor-pointer items-center gap-2 text-xs text-gray-600"
    title="When on, supplier changes to this field always wait for your review"
  >
    <Switch
      checked={checked}
      disabled={disabled}
      onCheckedChange={onChange}
      aria-label={`Always review ${label}`}
    />
    Always review
  </label>
);

export default AlwaysReviewSwitch;
