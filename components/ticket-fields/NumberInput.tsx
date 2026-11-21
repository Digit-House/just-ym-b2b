import { forwardRef, InputHTMLAttributes } from "react";
import InputField from "@/components/InputField";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> & {
  label?: string;
  errMsg?: string;
  value: number | string | null | undefined;
  onChange: (v: number | null) => void;
};

/** Number (not prices, which keep their own formatting): empty is null. */
const NumberInput = forwardRef<HTMLInputElement, Props>(({ value, onChange, ...rest }, ref) => (
  <InputField
    ref={ref}
    {...rest}
    type="number"
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
  />
));
NumberInput.displayName = "NumberInput";

export default NumberInput;
