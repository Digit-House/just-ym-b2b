import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  errMsg?: string;
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, isRequired, errMsg, className, id, type, disabled, ...rest },
    ref
  ) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={cn("flex w-full flex-col gap-2", className)}>
        {label && (
          <label
            htmlFor={id}
            className="flex items-center gap-1 text-sm font-medium"
          >
            {label}

            {isRequired &&
              (disabled ? (
                <LockKeyhole
                  size={12}
                  className="text-red-500 mb-[1px]"
                />
              ) : (
                <span className="text-red-500">*</span>
              ))}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={isPassword && showPassword ? "text" : type}
            disabled={disabled}
            className={cn(
              "w-full border rounded-md px-3 py-2 text-sm pr-10",
              disabled
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "border-gray-300",
              errMsg && !disabled && "border-red-500"
            )}
            {...rest}
          />

          {isPassword && !disabled && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {errMsg && !disabled && (
          <p className="text-red-500 text-sm">{errMsg}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
