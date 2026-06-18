import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn("p-3 bg-white border rounded-md shadow-md", className)}
      classNames={{
        ...defaultClassNames,
        months: "relative flex flex-col gap-4",
        month: "space-y-4",
        // CAPTION: Contains the dropdowns.
        // We use relative and a height to ensure it doesn't overlap the grid below.
        month_caption: "flex justify-center h-8 items-center relative mb-4",
        caption_label: cn(
          "text-sm font-medium",
          captionLayout !== "label" && "hidden"
        ),

        // DROPDOWNS: Ensure they don't have huge invisible hitboxes
        caption_dropdowns: "flex justify-center gap-1 font-medium z-30",
        dropdown_container: "relative flex items-center px-1",
        dropdown:
          "appearance-none bg-transparent py-1 pl-2 pr-6 border-none hover:bg-slate-100 rounded cursor-pointer outline-none text-sm font-semibold",

        // NAVIGATION: Use pointer-events-none on the container
        // and pointer-events-auto on buttons so they don't block the grid.
        nav: "flex items-center justify-between absolute w-full top-0 left-0 pointer-events-none z-10",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-white p-0 opacity-50 hover:opacity-100 pointer-events-auto"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-white p-0 opacity-50 hover:opacity-100 pointer-events-auto"
        ),

        // GRID: Corrected spacing to prevent overlap
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex w-full mb-2",
        weekday:
          "text-muted-foreground w-9 font-normal text-[0.8rem] flex-1 text-center",
        week: "flex w-full mt-1",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex-1 flex items-center justify-center relative z-20"
        ),
        selected:
          "bg-indigo-700 text-white hover:bg-indigo-700 hover:text-white",
        outside: "text-muted-foreground opacity-50",
        today: "bg-accent text-accent-foreground",
        disabled: "text-muted-foreground opacity-50",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left")
            return <ChevronLeftIcon className="h-4 w-4" />;
          if (orientation === "right")
            return <ChevronRightIcon className="h-4 w-4" />;
          // This is the little arrow inside the dropdown
          return (
            <ChevronDownIcon className="h-3 w-3 ml-1 opacity-50 absolute right-1 pointer-events-none" />
          );
        },
      }}
      {...props}
    />
  );
}

export { Calendar };

// import * as React from "react";
// import {
//   ChevronDownIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from "lucide-react";
// import {
//   DayPicker,
//   getDefaultClassNames,
//   type DayButton,
// } from "react-day-picker";

// import { cn } from "@/lib/utils";
// import { Button, buttonVariants } from "@/components/ui/button";

// function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   captionLayout = "label",
//   buttonVariant = "ghost",
//   formatters,
//   components,
//   ...props
// }: React.ComponentProps<typeof DayPicker> & {
//   buttonVariant?: React.ComponentProps<typeof Button>["variant"];
// }) {
//   const defaultClassNames = getDefaultClassNames();

//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn(
//         "bg-background group/calendar p-3 [--cell-size:--spacing(8)]",
//         className
//       )}
//       captionLayout={captionLayout}
//       formatters={{
//         formatMonthDropdown: (date) =>
//           date.toLocaleString("default", { month: "short" }),
//         ...formatters,
//       }}
//       classNames={{
//         root: cn("w-fit", defaultClassNames.root),
//         months: cn("flex gap-4 flex-col md:flex-row", defaultClassNames.months),
//         month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
//         nav: cn(
//           "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
//           defaultClassNames.nav
//         ),
//         button_previous: cn(
//           buttonVariants({ variant: buttonVariant }),
//           "size-(--cell-size) p-0",
//           defaultClassNames.button_previous
//         ),
//         button_next: cn(
//           buttonVariants({ variant: buttonVariant }),
//           "size-(--cell-size) p-0",
//           defaultClassNames.button_next
//         ),
//         month_caption: cn(
//           "flex items-center justify-center h-(--cell-size) w-full",
//           defaultClassNames.month_caption
//         ),
//         table: "w-full border-collapse",
//         weekdays: cn("flex", defaultClassNames.weekdays),
//         weekday: cn(
//           "text-muted-foreground flex-1 text-[0.8rem]",
//           defaultClassNames.weekday
//         ),
//         week: cn("flex w-full mt-2", defaultClassNames.week),
//         day: cn(
//           "relative w-full aspect-square select-none",
//           defaultClassNames.day
//         ),

//         /* 🔥 RANGE COLORS */
//         range_start: cn(
//           "bg-indigo-700 text-white rounded-l-md",
//           defaultClassNames.range_start
//         ),
//         range_middle: cn(
//           "bg-gray-200 text-gray-900 rounded-none",
//           defaultClassNames.range_middle
//         ),
//         range_end: cn(
//           "bg-indigo-700 text-white rounded-r-md",
//           defaultClassNames.range_end
//         ),

//         today: cn("bg-accent rounded-md", defaultClassNames.today),
//         outside: cn("text-muted-foreground", defaultClassNames.outside),
//         disabled: cn("opacity-50", defaultClassNames.disabled),
//         hidden: cn("invisible", defaultClassNames.hidden),
//         ...classNames,
//       }}
//       components={{
//         Chevron: ({ className, orientation, ...props }) => {
//           if (orientation === "left")
//             return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
//           if (orientation === "right")
//             return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
//           return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
//         },
//         DayButton: CalendarDayButton,
//         ...components,
//       }}
//       {...props}
//     />
//   );
// }

// function CalendarDayButton({
//   className,
//   day,
//   modifiers,
//   ...props
// }: React.ComponentProps<typeof DayButton>) {
//   const defaultClassNames = getDefaultClassNames();
//   const ref = React.useRef<HTMLButtonElement>(null);

//   React.useEffect(() => {
//     if (modifiers.focused) ref.current?.focus();
//   }, [modifiers.focused]);

//   return (
//     <Button
//       ref={ref}
//       variant="ghost"
//       size="icon"
//       data-selected-single={
//         modifiers.selected &&
//         !modifiers.range_start &&
//         !modifiers.range_end &&
//         !modifiers.range_middle
//       }
//       data-range-start={modifiers.range_start}
//       data-range-end={modifiers.range_end}
//       data-range-middle={modifiers.range_middle}
//       className={cn(
//         /* Single day */
//         "data-[selected-single=true]:bg-indigo-700 data-[selected-single=true]:text-white",

//         /* Middle days (GRAY) */
//         "data-[range-middle=true]:bg-gray-200 data-[range-middle=true]:text-gray-900",

//         /* Start & End */
//         "data-[range-start=true]:bg-indigo-700 data-[range-start=true]:text-white",
//         "data-[range-end=true]:bg-indigo-700 data-[range-end=true]:text-white",

//         defaultClassNames.day,
//         className
//       )}
//       {...props}
//     />
//   );
// }

// export { Calendar };
