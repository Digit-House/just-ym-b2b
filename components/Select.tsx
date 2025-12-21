import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  name: string;
  id: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  width?: string; // tailwind width class e.g. "w-56"
}

export default function Select({
  label,
  placeholder = 'Select',
  options,
  value,
  onChange,
  width = 'w-full',
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
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className={`relative ${width}`} ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full  items-center mx-2 gap-2 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span className="truncate">
          {value.length > 0
            ? `${placeholder} (${value.length})`
            : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg-white p-4 shadow-xl">
          {label && (
            <p className="mb-3 text-sm font-semibold text-gray-800">
              {label}
            </p>
          )}

          <div className="space-y-5 h-[200px] overflow-scroll">
            {options.map(option => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.id)}
                  onChange={() => toggle(option.id)}
                  className="min-h-4 min-w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {option.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
