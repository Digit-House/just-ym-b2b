import { ReactNode } from "react";
import DiffView, { toPlain } from "@/components/DiffView";

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

const plain = (v: unknown) =>
  Array.isArray(v) ? v.map((x) => toPlain(String(x))).join("\n") : v == null ? "" : toPlain(String(v));

/**
 * Diff view of one content field (D10). Left: supplier baseline, read-only, shown only when the field
 * was edited, else "Same as supplier". Right: `children`, the editable control. Never saves the baseline (N11).
 */
const ContentDiffField = ({
  field,
  label,
  edited,
  baseline,
  current,
  pending,
  onShowPending,
  children,
}: {
  field: string;
  label: string;
  edited: boolean;
  baseline: unknown;
  current: unknown;
  pending?: boolean;
  onShowPending?: () => void;
  children: ReactNode;
}) => (
  <div className="space-y-2">
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">Supplier ({label})</p>
        {edited ? (
          <div className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
            {plain(baseline) || <span className="text-gray-400">Empty</span>}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-gray-200 p-3 text-sm italic text-gray-400">
            Same as supplier
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
    {edited && !same(baseline, current) && (
      <div className="rounded-md bg-gray-50 p-3" data-testid={`diff-${field}`}>
        <DiffView field={field} hideLabel oldValue={baseline} newValue={current} />
      </div>
    )}
    {pending && (
      <p className="text-xs text-amber-700">
        Supplier has a newer value.{" "}
        {onShowPending && (
          <button type="button" onClick={onShowPending} className="font-medium underline">
            Review it in Supplier updates
          </button>
        )}
      </p>
    )}
  </div>
);

export default ContentDiffField;
