import * as React from "react"
import { cn } from "@/lib/utils"
import AutoResizeTextarea from "@/components/AutoResizeTextarea"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  autoResize?: boolean;
  minHeight?: number;
  maxHeight?: number;
}

function Textarea({ className, autoResize = false, minHeight, maxHeight, ...props }: TextareaProps) {
  if (autoResize) {
    return (
      <AutoResizeTextarea
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none overflow-hidden",
          className
        )}
        minHeight={minHeight}
        maxHeight={maxHeight}
        {...props}
      />
    )
  }

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
