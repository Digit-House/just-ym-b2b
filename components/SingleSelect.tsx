import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  name: string;
  id: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;                 // ✅ single value
  onChange: (value: string) => void; // ✅ single value
  width?: string;
}

export default function SingleSelect({
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
  width = "w-full",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedOption = options?.find(o => o.id === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false); // close after select
  };

  return (
    <div className={`relative ${width}`} ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center mx-2 gap-2 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 min-w-38 rounded-xl bg-white p-4 shadow-xl">
          {label && (
            <p className="mb-3 text-sm font-semibold text-gray-800">
              {label}
            </p>
          )}

          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {options.map(option => {
              const active = value === option.id;

              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition
                    ${active
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {option.name}
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
