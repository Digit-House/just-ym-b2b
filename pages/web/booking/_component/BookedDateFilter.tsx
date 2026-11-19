import { useState } from "react";
import {
  addDays,
  addMonths,
  format,
  isValid,
  parse,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { DateRange } from "react-day-picker";
import SortSelect, { SortOption } from "@/components/SortSelect";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

// "all" | "YYYY-MM" | picked range as yyyy-MM-dd strings (stored in localStorage).
export type BookedChoice = "all" | string | { from: string; to: string };

const DAY = "yyyy-MM-dd";
const MONTH = "yyyy-MM";
const CUSTOM = "custom";

const parseDay = (s: unknown) =>
  typeof s === "string" ? parse(s, DAY, new Date()) : new Date(NaN);

const monthValues = () => {
  const base = startOfMonth(new Date());
  return Array.from({ length: 12 }, (_, i) => subMonths(base, i));
};

// Old or tampered saved values fall back to "All dates".
export const sanitizeBookedChoice = (v: any): BookedChoice => {
  if (typeof v === "string") {
    return monthValues().some((m) => format(m, MONTH) === v) ? v : "all";
  }
  if (v && isValid(parseDay(v.from)) && isValid(parseDay(v.to))) {
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

interface Props {
  value: BookedChoice;
  onChange: (v: BookedChoice) => void;
}

export default function BookedDateFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>();

  const months = monthValues();
  const options: SortOption[] = [
    { label: "All dates", value: "all" },
    { label: "This month", value: format(months[0], MONTH) },
    ...months
      .slice(1)
      .map((m) => ({ label: format(m, "MMM yyyy"), value: format(m, MONTH) })),
    {
      label: typeof value === "object" ? rangeLabel(value) : "Custom range…",
      value: CUSTOM,
    },
  ];

  const handleSelect = (v: string) => {
    if (v === CUSTOM) {
      setDraft(
        typeof value === "object"
          ? { from: parseDay(value.from), to: parseDay(value.to) }
          : undefined,
      );
      setOpen(true);
      return;
    }
    onChange(v);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="min-w-0">
          <SortSelect
            label="Booked:"
            options={options}
            value={typeof value === "object" ? CUSTOM : value}
            onChange={handleSelect}
            reselectable
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-auto max-w-[calc(100vw-1rem)] p-0"
        align="start"
      >
        <Calendar
          mode="range"
          numberOfMonths={1}
          defaultMonth={draft?.from}
          selected={draft}
          disabled={{ after: new Date() }}
          onSelect={(range) => {
            setDraft(range);
            if (!range?.from || !range?.to) return;
            onChange({ from: format(range.from, DAY), to: format(range.to, DAY) });
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
