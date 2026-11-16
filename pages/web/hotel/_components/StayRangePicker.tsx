import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  addMonths,
  differenceInCalendarDays,
  format,
  isLastDayOfMonth,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DayPicker, type DateRange, type DayButton } from "react-day-picker";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import {
  MAX_STAY_NIGHTS,
  nightsBetween,
  pickStayDay,
  stayHint,
  stayNights,
} from "@/lib/stayRange";

// Port of just-ym-hotel-ticket's StayRangePicker (react-day-picker 10 there, 9 here),
// in the b2b indigo palette and with plain English strings.

type Cell = { label: string; full?: string; kind: "in" | "out" | "today" | "" };
type DayInfo = { cell: (date: Date, today: boolean) => Cell; tip: (date: Date) => string };

const DayInfoContext = createContext<DayInfo>({
  cell: () => ({ label: "", kind: "" }),
  tip: () => "",
});

const DAY_BUTTON =
  "relative z-[1] mx-0.5 my-[3px] flex h-12 w-[calc(100%-4px)] cursor-pointer flex-col items-center justify-center gap-px rounded-xl p-0 text-slate-800 outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:text-slate-300 enabled:hover:bg-indigo-100 md:h-[46px]";

// Module-level so its identity is stable across renders (no remount, focus stays).
const StayDayButton = ({
  day,
  modifiers,
  children,
  className,
  ...rest
}: React.ComponentProps<typeof DayButton>) => {
  const info = useContext(DayInfoContext);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const { label, full, kind } = info.cell(day.date, !!modifiers.today);
  const tip = info.tip(day.date);
  const col = day.date.getDay();
  const selected = kind === "in" || kind === "out";
  const preview = !!modifiers.stayPreviewEnd;
  return (
    <>
      <button
        ref={ref}
        type="button"
        {...rest}
        data-day={day.date.toLocaleDateString()}
        data-stay={kind || undefined}
        aria-label={selected ? `${rest["aria-label"] ?? ""}, ${full}` : rest["aria-label"]}
        className={cn(
          DAY_BUTTON,
          selected &&
            (preview
              ? "bg-indigo-400 text-white enabled:hover:bg-indigo-400"
              : "bg-indigo-700 text-white enabled:hover:bg-indigo-700"),
          modifiers.stayDim && "opacity-35",
          className,
        )}
      >
        <span className="text-[15px] leading-[1.1] font-semibold">{children}</span>
        <span
          className={cn(
            "min-h-[9px] text-[9px] leading-none font-semibold whitespace-nowrap",
            selected ? "font-bold text-white" : "text-slate-500",
          )}
        >
          {label}
        </span>
      </button>
      {tip && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-[calc(100%-2px)] z-20 rounded-lg bg-slate-800 px-2 py-[3px] text-[11px] font-semibold whitespace-nowrap text-white [@media(hover:none)]:hidden",
            col === 0 ? "left-0" : col === 6 ? "right-0" : "left-1/2 -translate-x-1/2",
          )}
        >
          {tip}
        </span>
      )}
    </>
  );
};

const NavChevron = ({ orientation }: { orientation?: string }) =>
  orientation === "left" ? (
    <ChevronLeft className="size-5" strokeWidth={2.5} />
  ) : (
    <ChevronRight className="size-5" strokeWidth={2.5} />
  );

const NAV_BUTTON =
  "pointer-events-auto grid size-10 cursor-pointer place-items-center rounded-full text-slate-800 outline-none focus-visible:outline-2 focus-visible:outline-indigo-600 enabled:hover:bg-indigo-50 disabled:cursor-default disabled:opacity-25 aria-disabled:cursor-default aria-disabled:opacity-25";

// The band behind a stay is the day cell's ::before, rounded only at week/month edges.
const CLASS_NAMES = {
  root: "w-full",
  months: "relative grid md:grid-cols-2 md:gap-8",
  month: "max-md:mb-5",
  nav: "pointer-events-none absolute inset-x-0 top-0 z-[2] flex items-center justify-between max-md:hidden",
  button_previous: NAV_BUTTON,
  button_next: NAV_BUTTON,
  month_caption:
    "flex h-10 items-center justify-center max-md:sticky max-md:top-0 max-md:z-[2] max-md:bg-white",
  caption_label: "text-[15px] font-bold text-slate-800 select-none",
  month_grid: "w-full border-collapse",
  weekdays: "grid h-6 grid-cols-7 items-center max-md:hidden",
  weekday: "text-center text-[11px] font-semibold text-slate-500 select-none",
  week: "grid grid-cols-7",
  day: "relative h-[54px] p-0 text-center before:absolute before:inset-x-0 before:top-[3px] before:bottom-[3px] before:origin-left before:scale-x-0 before:bg-indigo-50 before:transition-transform before:duration-150 before:ease-out motion-reduce:before:transition-none md:h-[52px]",
  hidden: "invisible",
  outside: "invisible",
};
const MODIFIER_CLASS_NAMES = {
  stayMid: "before:scale-x-100",
  stayHead: "before:left-1/2 before:scale-x-100",
  stayTail: "before:right-1/2 before:scale-x-100",
  stayCapL: "before:rounded-l-xl",
  stayCapR: "before:rounded-r-xl",
};

const Dot = ({ on }: { on: boolean }) => (
  <i className={cn("size-2 rounded-full", on ? "bg-indigo-600" : "bg-slate-200")} />
);

const nightsText = (n: number) => `${n} night${n === 1 ? "" : "s"}`;
const dayText = (d: Date, pattern = "EEE, MMM d") => format(d, pattern);

type Props = {
  /** The draft stay, edited as the user picks. */
  value: DateRange | undefined;
  onSelect: (next: DateRange | undefined) => void;
  /** Final stay: desktop as soon as check-out is picked, otherwise on Done. */
  onComplete: (range: DateRange) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The existing check-in / check-out field button. */
  trigger: ReactNode;
};

/**
 * Check-in / check-out picker: step header, band preview on hover, per-day tooltip,
 * 30-night cap. Popover with 2 months on desktop, full-height sheet on phones.
 */
const StayRangePicker = ({ value, onSelect, onComplete, open, onOpenChange, trigger }: Props) => {
  const isWide = useMediaQuery("(min-width: 768px)");
  const [hover, setHover] = useState<Date | null>(null);
  const [note, setNote] = useState<{ kind: "moved" | "tooLong"; date: Date } | null>(null);

  useEffect(() => {
    if (!open) {
      setHover(null);
      setNote(null);
    }
  }, [open]);

  const from = value?.from;
  const to = value?.to;
  const picking = !!from && !to;
  const hoverNights = from && hover ? nightsBetween(from, hover) : 0;
  const preview =
    picking && hover && hoverNights > 0 && hoverNights <= MAX_STAY_NIGHTS ? hover : null;
  const end = to ?? preview;
  const today = startOfDay(new Date());

  const dayInfo: DayInfo = {
    cell: (date, isToday) => {
      if (from && isSameDay(date, from))
        return { label: "In", full: "Check-in", kind: "in" };
      if (end && isSameDay(date, end))
        return { label: "Out", full: "Check-out", kind: "out" };
      return isToday ? { label: "Today", kind: "today" } : { label: "", kind: "" };
    },
    tip: (date) => {
      const hint = hover && isSameDay(date, hover) ? stayHint(value, date) : null;
      if (!hint) return "";
      return hint.kind === "nights"
        ? nightsText(hint.nights)
        : hint.kind === "max"
          ? `Max ${MAX_STAY_NIGHTS} nights`
          : `Check-in ${dayText(date, "d MMMM")}`;
    },
  };

  const isMid = (d: Date) =>
    !!from &&
    !!end &&
    differenceInCalendarDays(d, from) > 0 &&
    differenceInCalendarDays(d, end) < 0;
  const modifiers = {
    stayMid: isMid,
    stayHead: (d: Date) =>
      !!from && !!end && isSameDay(d, from) && d.getDay() !== 6 && !isLastDayOfMonth(d),
    stayTail: (d: Date) =>
      !!end && isSameDay(d, end) && d.getDay() !== 0 && d.getDate() !== 1,
    stayCapL: (d: Date) => isMid(d) && (d.getDay() === 0 || d.getDate() === 1),
    stayCapR: (d: Date) => isMid(d) && (d.getDay() === 6 || isLastDayOfMonth(d)),
    stayPreviewEnd: (d: Date) => !!preview && isSameDay(d, preview),
    // Days that cannot be a check-out for the current check-in.
    stayDim: (d: Date) =>
      picking &&
      !!from &&
      differenceInCalendarDays(d, today) >= 0 &&
      (differenceInCalendarDays(d, from) < 0 ||
        differenceInCalendarDays(d, from) > MAX_STAY_NIGHTS),
  };

  const handleSelect = (_: unknown, day: Date) => {
    const pick = pickStayDay(value, day);
    if (pick.kind === "tooLong") {
      const start = from ?? day;
      setNote({
        kind: "tooLong",
        date: new Date(start.getFullYear(), start.getMonth(), start.getDate() + MAX_STAY_NIGHTS),
      });
      return;
    }
    setNote(
      pick.kind === "moved" && pick.range.from
        ? { kind: "moved", date: pick.range.from }
        : null,
    );
    onSelect(pick.range);
    if (isWide && pick.range.from && pick.range.to) onComplete(pick.range);
  };

  const nights = stayNights(value);
  const startMonth = startOfMonth(today);

  const stepText = from && to ? "Dates selected" : from ? "Select check-out" : "Select check-in";
  const step = (
    <div className="flex items-center gap-2.5 text-[15px] font-bold text-slate-800">
      <CalendarIcon className="size-4 text-indigo-600" aria-hidden="true" />
      <p role="status">{stepText}</p>
      <span aria-hidden="true" className="flex gap-1">
        <Dot on={!!from} />
        <Dot on={!!to} />
      </span>
      {!!nights && (
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
          {nightsText(nights)}
        </span>
      )}
    </div>
  );
  const noteLine = (
    <p role="status" className="mt-2 min-h-5 text-xs font-semibold text-amber-700">
      {note &&
        (note.kind === "moved"
          ? `Check-in moved to ${dayText(note.date)}`
          : `Stays are limited to ${MAX_STAY_NIGHTS} nights. Latest check-out ${dayText(note.date)}.`)}
    </p>
  );
  const calendar = (
    <DayInfoContext.Provider value={dayInfo}>
      <DayPicker
        mode="range"
        selected={value}
        onSelect={handleSelect}
        defaultMonth={isWide && from && from >= today ? from : today}
        startMonth={startMonth}
        endMonth={addMonths(startMonth, 11)}
        numberOfMonths={isWide ? 2 : 12}
        weekStartsOn={0}
        disabled={{ before: today }}
        classNames={CLASS_NAMES}
        components={{ DayButton: StayDayButton, Chevron: NavChevron }}
        modifiers={modifiers}
        modifiersClassNames={MODIFIER_CLASS_NAMES}
        onDayMouseEnter={(date, mods) => setHover(mods.disabled ? null : date)}
        onDayMouseLeave={() => setHover(null)}
        onDayFocus={(date, mods, e) =>
          // Keyboard focus only: opening the panel focuses a day too.
          setHover(!mods.disabled && e.target.matches(":focus-visible") ? date : null)
        }
        onDayBlur={() => setHover(null)}
      />
    </DayInfoContext.Provider>
  );

  // Focus lands on the check-in day (or today), not the month buttons.
  const onOpenAutoFocus = (e: Event) => {
    e.preventDefault();
    const panel = e.target as HTMLElement;
    if (!isWide) panel.querySelector("[data-stay=in]")?.scrollIntoView?.({ block: "center" });
    const day = panel.querySelector<HTMLElement>(
      'button[data-day]:not([tabindex="-1"]):not(:disabled)',
    );
    (day ?? panel).focus({ preventScroll: true });
  };

  const done = () => {
    if (value?.from && value.to) onComplete(value);
    onOpenChange(false);
  };
  const clear = () => {
    setNote(null);
    onSelect(undefined);
  };
  const clearButton = (
    <button
      type="button"
      disabled={!from}
      onClick={clear}
      className="min-h-9 cursor-pointer px-2 text-sm font-semibold text-slate-500 outline-none hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-45"
    >
      Clear
    </button>
  );
  const doneButton = (
    <button
      type="button"
      disabled={!from || !to}
      onClick={done}
      className="min-h-9 cursor-pointer rounded-full bg-indigo-700 px-5 text-sm font-bold text-white outline-none hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-45"
    >
      Done
    </button>
  );

  if (isWide)
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          className="w-[min(760px,calc(100vw-24px))] rounded-2xl p-4"
          align="start"
          collisionPadding={12}
          onOpenAutoFocus={onOpenAutoFocus}
        >
          <div className="flex items-center justify-between gap-3">
            {step}
            <div className="flex items-center gap-1">
              {clearButton}
              {doneButton}
            </div>
          </div>
          {noteLine}
          {calendar}
        </PopoverContent>
      </Popover>
    );

  // Phones: a full-height sheet (Radix Dialog locks page scroll) with pinned title,
  // step and weekdays, scrolling months, pinned Clear / Done.
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onOpenAutoFocus={onOpenAutoFocus}
          className="fixed inset-x-0 bottom-0 z-50 flex h-[92dvh] flex-col rounded-t-2xl bg-white text-slate-800 shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom motion-reduce:animate-none"
        >
          <div className="shrink-0 px-3 pt-3">
            <div className="flex items-center justify-between">
              <DialogPrimitive.Title className="text-base font-bold">
                Select dates
              </DialogPrimitive.Title>
              <DialogPrimitive.Close
                aria-label="Close"
                className="grid size-11 cursor-pointer place-items-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-indigo-600"
              >
                <X className="size-5" />
              </DialogPrimitive.Close>
            </div>
            {step}
            {noteLine}
            <div
              aria-hidden="true"
              className="grid h-6 grid-cols-7 items-center text-center text-[11px] font-semibold text-slate-500"
            >
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3">{calendar}</div>
          <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="min-w-0 flex-1">
              {from && to && nights !== null ? (
                <>
                  <p className="text-sm font-bold whitespace-nowrap">
                    {dayText(from, "MMM d")} – {dayText(to, "MMM d")}
                  </p>
                  <p className="text-xs font-semibold whitespace-nowrap text-slate-500">
                    {nightsText(nights)}
                  </p>
                </>
              ) : (
                <p className="text-sm font-bold">{stepText}</p>
              )}
            </div>
            {clearButton}
            {doneButton}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default StayRangePicker;
