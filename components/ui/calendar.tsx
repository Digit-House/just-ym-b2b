import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)]",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-4 flex-col md:flex-row", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full",
          defaultClassNames.month_caption
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 text-[0.8rem]",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn(
          "relative w-full aspect-square select-none",
          defaultClassNames.day
        ),

        /* 🔥 RANGE COLORS */
        range_start: cn(
          "bg-indigo-700 text-white rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "bg-gray-200 text-gray-900 rounded-none",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "bg-indigo-700 text-white rounded-r-md",
          defaultClassNames.range_end
        ),

        today: cn("bg-accent rounded-md", defaultClassNames.today),
        outside: cn("text-muted-foreground", defaultClassNames.outside),
        disabled: cn("opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left")
            return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
          if (orientation === "right")
            return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
          return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        /* Single day */
        "data-[selected-single=true]:bg-indigo-700 data-[selected-single=true]:text-white",

        /* Middle days (GRAY) */
        "data-[range-middle=true]:bg-gray-200 data-[range-middle=true]:text-gray-900",

        /* Start & End */
        "data-[range-start=true]:bg-indigo-700 data-[range-start=true]:text-white",
        "data-[range-end=true]:bg-indigo-700 data-[range-end=true]:text-white",

        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar };
