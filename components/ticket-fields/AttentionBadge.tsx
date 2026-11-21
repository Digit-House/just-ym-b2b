import { SupplierUpdateT } from "@/types/contentEditor.type";
import { fieldLabel } from "@/util/contentLabels";

/** One thing that needs attention: a pending supplier change, or a change not saved yet. */
export type AttentionItem = {
  kind: "supplier" | "unsaved";
  /** Tab id of the page that shows it. */
  tab: string;
  optionId?: string | null;
  entityName: string;
  entityId: string;
  field: string;
  label: string;
  /** Unsaved because it is a staged supplier choice. */
  staged?: boolean;
};

/** Pending supplier updates, not yet resolved, as items. A staged choice is unsaved, not pending (see unsavedFromStaged). */
export const supplierItems = (
  updates: SupplierUpdateT[],
  staged: Record<string, unknown>,
  tabOf: (su: SupplierUpdateT) => string,
  optionOf: (su: SupplierUpdateT) => string | undefined
): AttentionItem[] =>
  updates.map((su) => ({
    kind: staged[su.id] ? "unsaved" : "supplier",
    staged: !!staged[su.id],
    tab: tabOf(su),
    optionId: optionOf(su),
    entityName: su.entityName,
    entityId: su.entityId,
    field: su.field,
    label: fieldLabel(su.field),
  }));

/** Amber dot + count (supplier) and blue dot + count (unsaved); nothing when both are 0. Tooltip on hover and focus. */
const AttentionBadge = ({ items }: { items: AttentionItem[] }) => {
  const uniq = (kind: AttentionItem["kind"]) => {
    const seen = new Map<string, string>();
    items.filter((i) => i.kind === kind).forEach((i) => seen.set(`${i.entityName}:${i.entityId}:${i.field}`, i.label));
    return [...seen.values()];
  };
  const supplier = uniq("supplier");
  const unsaved = uniq("unsaved");
  if (!supplier.length && !unsaved.length) return null;
  const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const text = [
    supplier.length && `${plural(supplier.length, "supplier change")}`,
    unsaved.length && `${plural(unsaved.length, "unsaved change")}`,
  ]
    .filter(Boolean)
    .join(", ");
  const dot = (color: string, n: number) =>
    n > 0 && (
      <span className="flex items-center gap-1">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        {n}
      </span>
    );
  return (
    <span className="group relative inline-flex">
      <span
        tabIndex={0}
        aria-label={text}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-semibold text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {dot("bg-amber-500", supplier.length)}
        {dot("bg-blue-500", unsaved.length)}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-40 mt-1 hidden w-56 space-y-2 rounded-md bg-gray-900 p-2 text-left text-xs font-normal text-white shadow-lg group-focus-within:block group-hover:block"
      >
        {supplier.length > 0 && (
          <span className="block">
            <span className="block font-semibold text-amber-300">● {plural(supplier.length, "supplier change")}</span>
            {supplier.join(", ")}
          </span>
        )}
        {unsaved.length > 0 && (
          <span className="block">
            <span className="block font-semibold text-blue-300">● {plural(unsaved.length, "unsaved change")}</span>
            {unsaved.join(", ")}
          </span>
        )}
      </span>
    </span>
  );
};

export const UnsavedChip = () => (
  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">Unsaved</span>
);

export default AttentionBadge;
