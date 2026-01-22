import React, { forwardRef, TextareaHTMLAttributes } from "react";
import AutoResizeTextarea from "./AutoResizeTextarea";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  isRequired?: boolean;
  errMsg?: string;
  minHeight?: number;
  maxHeight?: number;
}

const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(({ label, isRequired, errMsg, id, minHeight, maxHeight, ...rest }, ref) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>

      <AutoResizeTextarea
        ref={ref}
        id={id}
        className="w-full border rounded-md px-3 py-2 text-sm"
        minHeight={minHeight}
        maxHeight={maxHeight}
        {...rest}
      />

      {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}
    </div>
  );
});

TextareaField.displayName = "TextareaField";

export default TextareaField;
