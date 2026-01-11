import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  errMsg?: string;
  className?:string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, isRequired, errMsg,className,id, ...rest }, ref) => {
    return (
      <div className={cn("flex flex-col gap-2 w-full",className)}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium">
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref} // Attach the forwarded ref here
          id={id}
          className="w-full border rounded-md px-3 py-2 text-sm"
          {...rest}
        />

        {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
