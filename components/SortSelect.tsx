import { useEffect, useRef, useState } from "react";
import { ChevronDown, MoveUp } from "lucide-react";

export interface SortOption {
  label: string;
  value: string;
}

interface SortSelectProps {
  label?: string;
  placeholder?: string;
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  width?: string;
}

export default function SortSelect({
  label = "Sort by:",
  placeholder = "Sort By",
  options,
  value,
  onChange,
}: SortSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div className={`relative border rounded-sm `} ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span className="truncate flex gap-2 text-gray-500">
          {label}
          <p className="text-black">{selectedLabel}</p>
        </span>
        <MoveUp className="h-4 w-4" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg-white p-4 shadow-xl">
          <p className="mb-3 text-sm font-semibold text-gray-800">{label}</p>

          <div className="space-y-3">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="sort"
                  checked={value === option.value}
                  onChange={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
