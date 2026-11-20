import { ReactNode } from "react";
import { Lock } from "lucide-react";
import DiffView, { toPlain } from "@/components/DiffView";

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

const plain = (v: unknown) =>
  Array.isArray(v) ? v.map((x) => toPlain(String(x))).join("\n") : v == null ? "" : toPlain(String(v));

/**
 * Diff body of one content field (D10). Supplier column: baseline, read-only, shown only when the field
 * was edited, else "Same as supplier". Current column: `children`, the editable control. Never saves the baseline (N11).
 * `disabled` disables every input (fieldset) and hides the actions.
 */
const ContentDiffField = ({
  field,
  edited,
  baseline,
  current,
  pending,
  onShowPending,
  disabled,
  locked,
  stack,
  children,
}: {
  field: string;
  label?: string;
  edited: boolean;
  baseline: unknown;
  current: unknown;
  pending?: boolean;
  onShowPending?: () => void;
  disabled?: boolean;
  /** Saved-version page: columns read Before / After. */
  locked?: boolean;
  /** Supplier above Current, both full width: for wide controls (English and Myanmar lists). */
  stack?: boolean;
  children: ReactNode;
}) => (
  <div className="space-y-3">
    <div className={stack ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
      <div className="space-y-1">
        <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-500">
          <Lock size={12} /> {locked ? "Before" : "Supplier"}
        </p>
        {edited ? (
          <div className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
            {plain(baseline) || <span className="text-gray-400">Empty</span>}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-sm italic text-gray-400">
            {locked ? "Not changed in this save" : "Same as supplier"}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{locked ? "After" : "Current"}</p>
        <fieldset disabled={disabled} className="min-w-0">
          {children}
        </fieldset>
      </div>
    </div>
    {edited && !same(baseline, current) && (
      <div className="rounded-md bg-gray-50 p-3" data-testid={`diff-${field}`}>
        <DiffView field={field} hideLabel oldValue={baseline} newValue={current} />
      </div>
    )}
    {pending && (
      <p className="text-xs text-amber-700">
        Supplier has a newer value.{" "}
        {onShowPending && !disabled && (
          <button type="button" onClick={onShowPending} className="font-medium underline">
            Review it in Supplier updates
          </button>
        )}
      </p>
    )}
  </div>
);

export default ContentDiffField;
