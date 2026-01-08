import React, { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  isRequired?: boolean;
  errMsg?: string;
}

const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(({ label, isRequired, errMsg, id, rows = 4, ...rest }, ref) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>

      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className="w-full border rounded-md px-3 py-2 text-sm resize-none"
        {...rest}
      />

      {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}
    </div>
  );
});

TextareaField.displayName = "TextareaField";

export default TextareaField;
