import { forwardRef, TextareaHTMLAttributes } from "react";
import TextareaField from "@/components/TextareaField";

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> & {
  label?: string;
  errMsg?: string;
  value: string | null | undefined;
  onChange: (v: string) => void;
  minHeight?: number;
  maxHeight?: number;
};

/** Multi-line plain text. */
const LongText = forwardRef<HTMLTextAreaElement, Props>(
  ({ label = "", value, onChange, minHeight = 120, maxHeight = 300, ...rest }, ref) => (
    <TextareaField
      ref={ref}
      {...rest}
      label={label}
      minHeight={minHeight}
      maxHeight={maxHeight}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
);
LongText.displayName = "LongText";

export default LongText;
