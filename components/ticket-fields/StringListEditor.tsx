import { Plus, Trash2 } from "lucide-react";
import TextareaField from "@/components/TextareaField";
import { Button } from "@/components/ui/button";

/** List of text rows: grey card, hover-reveal trash, full-width add button. `minItems` stops removing the last rows. */
const StringListEditor = ({
  label,
  value,
  onChange,
  readOnly,
  addLabel,
  placeholder,
  minItems = 0,
}: {
  label: string;
  value: string[] | null | undefined;
  onChange: (v: string[]) => void;
  readOnly?: boolean;
  addLabel: string;
  placeholder?: string;
  minItems?: number;
}) => {
  const items = value ?? [];
  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
      {items.map((item, i) => (
        <div key={i} className="relative group">
          <TextareaField
            label=""
            aria-label={`${label} ${i + 1}`}
            value={item}
            onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
            placeholder={placeholder}
            minHeight={60}
            maxHeight={150}
          />
          {!readOnly && items.length > minItems && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${label} ${i + 1}`}
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
      {!readOnly && (
        <Button type="button" onClick={() => onChange([...items, ""])} size="sm" variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" /> {addLabel}
        </Button>
      )}
    </div>
  );
};

export default StringListEditor;
