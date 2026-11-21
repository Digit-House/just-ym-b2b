import { forwardRef, InputHTMLAttributes } from "react";
import InputField from "@/components/InputField";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  label?: string;
  errMsg?: string;
  value: string | null | undefined;
  onChange: (v: string) => void;
};

/** Single-line text: the one look for every plain input on the owner and content-editor ticket pages. */
const TextInput = forwardRef<HTMLInputElement, Props>(({ value, onChange, ...rest }, ref) => (
  <InputField ref={ref} {...rest} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
));
TextInput.displayName = "TextInput";

export default TextInput;
