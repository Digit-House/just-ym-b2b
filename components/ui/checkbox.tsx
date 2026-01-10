import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // base
        "peer size-5 shrink-0 rounded-[4px] border-2 border-gray-500 bg-white shadow-xs outline-none transition-all",

        // checked state
        "data-[state=checked]:border-indigo-700 data-[state=checked]:bg-indigo-700 data-[state=checked]:text-white",

        // focus
        "focus-visible:ring-2 focus-visible:ring-indigo-700/40 focus-visible:ring-offset-2",

        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
