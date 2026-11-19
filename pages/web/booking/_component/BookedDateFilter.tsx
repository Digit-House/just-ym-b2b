import { useState } from "react";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  format,
  isValid,
  parse,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { DateRange } from "react-day-picker";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// "all" | "YYYY-MM" | picked range as yyyy-MM-dd strings (stored in localStorage).
export type BookedChoice = "all" | string | { from: string; to: string };

const DAY = "yyyy-MM-dd";
const MONTH = "yyyy-MM";
const MIN_YEAR = 2020;
const MAX_DAYS = 366; // the API rejects longer ranges
const ORANGE = "bg-[#FF914D] text-white border-[#FF914D]";

const parseDay = (s: unknown) =>
  typeof s === "string" ? parse(s, DAY, new Date()) : new Date(NaN);

// Strict: "2026-2-3" and rollovers like "2026-02-31" are not valid days.
const validDay = (s: unknown) => {
  const d = parseDay(s);
  return isValid(d) && format(d, DAY) === s ? d : null;
};

const spanDays = (from: Date, to: Date) => differenceInCalendarDays(to, from) + 1;

// Old or tampered saved values fall back to "All dates".
export const sanitizeBookedChoice = (v: any): BookedChoice => {
  const today = startOfDay(new Date());
  if (typeof v === "string") {
    const m = parse(v, MONTH, new Date());
    return isValid(m) &&
      format(m, MONTH) === v &&
      m.getFullYear() >= MIN_YEAR &&
      m <= startOfMonth(today)
      ? v
      : "all";
  }
  const from = v && validDay(v.from);
  const to = v && validDay(v.to);
  if (from && to && from <= to && to <= today && spanDays(from, to) <= MAX_DAYS) {
    return { from: v.from, to: v.to };
  }
  return "all";
};

// purchasedFrom inclusive, purchasedTo exclusive; both local-time boundaries as ISO.
export const bookedChoiceToRange = (
  c: BookedChoice,
): { purchasedFrom?: string; purchasedTo?: string } => {
  if (c === "all") return {};
  if (typeof c === "string") {
    const start = startOfMonth(parse(c, MONTH, new Date()));
    return {
      purchasedFrom: start.toISOString(),
      purchasedTo: addMonths(start, 1).toISOString(),
    };
  }
  return {
    purchasedFrom: startOfDay(parseDay(c.from)).toISOString(),
    purchasedTo: startOfDay(addDays(parseDay(c.to), 1)).toISOString(),
  };
};

const rangeLabel = (c: { from: string; to: string }) => {
  const f = parseDay(c.from);
  const t = parseDay(c.to);
  return `${format(f, "d MMM")} – ${format(t, "d MMM yyyy")}`;
};

const valueLabel = (v: BookedChoice, thisMonth: string, lastMonth: string) => {
  if (v === "all") return "All dates";
  if (typeof v === "object") return rangeLabel(v);
  if (v === thisMonth) return "This month";
  if (v === lastMonth) return "Last month";
  return format(parse(v, MONTH, new Date()), "MMM yyyy");
};

const pill = (on: boolean) =>
  `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
    on ? ORANGE : "border-gray-300 text-gray-700 hover:bg-gray-50"
  }`;

interface Props {
  value: BookedChoice;
  onChange: (v: BookedChoice) => void;
}

export default function BookedDateFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"months" | "range">("months");
  const [year, setYear] = useState(new Date().getFullYear());
  const [draft, setDraft] = useState<DateRange | undefined>();
  const [tooLong, setTooLong] = useState(false);

  const now = new Date();
  const thisMonth = format(now, MONTH);
  const lastMonth = format(subMonths(now, 1), MONTH);
  const currentYear = now.getFullYear();

  // Re-seed the popover from the saved value each time it opens.
  const handleOpenChange = (o: boolean) => {
    if (o) {
      setTooLong(false);
      if (typeof value === "object") {
        setView("range");
        setDraft({ from: parseDay(value.from), to: parseDay(value.to) });
      } else {
        setView("months");
        setDraft(undefined);
        setYear(
          value === "all"
            ? currentYear
            : parse(value, MONTH, new Date()).getFullYear(),
        );
      }
    }
    setOpen(o);
  };

  const apply = (v: BookedChoice) => {
    onChange(v);
    setOpen(false);
  };

  // Own two-click logic: react-day-picker 9 completes a range on the first click.
  const handleDay = (day: Date) => {
    setTooLong(false);
    if (!draft?.from || draft.to) {
      setDraft({ from: day, to: undefined });
      return;
    }
    const [from, to] = day < draft.from ? [day, draft.from] : [draft.from, day];
    setDraft({ from, to });
    if (spanDays(from, to) > MAX_DAYS) {
      setTooLong(true);
      return;
    }
    apply({ from: format(from, DAY), to: format(to, DAY) });
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Filter by booked date"
          className="flex w-full min-w-0 items-center justify-between gap-2 rounded-sm border px-4 md:w-auto py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span className="flex min-w-0 items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-gray-500" />
            <span className="shrink-0 text-gray-500">Booked:</span>
            <span className="truncate text-black">
              {valueLabel(value, thisMonth, lastMonth)}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] max-w-[calc(100vw-1rem)] p-3"
        align="start"
        // Focus the panel, not the first chip, so no chip looks selected.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).focus();
        }}
      >
        {view === "months" ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={value === "all"}
                onClick={() => apply("all")}
                className={pill(value === "all")}
              >
                All dates
              </button>
              <button
                type="button"
                aria-pressed={value === thisMonth}
                onClick={() => apply(thisMonth)}
                className={pill(value === thisMonth)}
              >
                This month
              </button>
              <button
                type="button"
                aria-pressed={value === lastMonth}
                onClick={() => apply(lastMonth)}
                className={pill(value === lastMonth)}
              >
                Last month
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous year"
                disabled={year <= MIN_YEAR}
                onClick={() => setYear((y) => y - 1)}
                className="rounded-md p-1 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold">{year}</span>
              <button
                type="button"
                aria-label="Next year"
                disabled={year >= currentYear}
                onClick={() => setYear((y) => y + 1)}
                className="rounded-md p-1 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date(year, i, 1);
                const v = format(date, MONTH);
                const selected = value === v;
                const future = date > startOfMonth(now);
                return (
                  <button
                    key={v}
                    type="button"
                    disabled={future}
                    aria-label={format(date, "MMMM yyyy")}
                    aria-pressed={selected}
                    onClick={() => apply(v)}
                    className={`rounded-md border py-2 text-sm transition-colors ${
                      selected
                        ? ORANGE
                        : future
                          ? "cursor-not-allowed border-transparent text-gray-300"
                          : `border-transparent text-gray-800 hover:bg-gray-100 ${
                              v === thisMonth ? "ring-1 ring-[#FF914D]" : ""
                            }`
                    }`}
                  >
                    {format(date, "MMM")}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setDraft(undefined);
                setTooLong(false);
                setView("range");
              }}
              className="flex w-full items-center justify-between border-t pt-3 text-sm text-gray-700 hover:text-black"
            >
              Custom range…
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setView("months")}
              className="flex items-center rounded text-sm text-gray-600 hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <Calendar
              mode="range"
              numberOfMonths={1}
              defaultMonth={draft?.from}
              selected={draft}
              disabled={{ after: now }}
              onDayClick={handleDay}
              // A no-op onSelect makes `selected` controlled; without it react-day-picker 9 ignores draft updates.
              onSelect={() => {}}
              className="border-0 p-0 shadow-none"
            />
            {tooLong && (
              <p role="alert" className="text-xs text-red-600">
                Choose {MAX_DAYS} days or fewer
              </p>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
