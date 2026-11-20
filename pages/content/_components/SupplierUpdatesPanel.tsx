import { useState } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DiffView, { toPlain } from "@/components/DiffView";
import EmptyState from "@/components/EmptyState";
import MascotLoader from "@/components/MascotLoader";
import { getProductContent, getSupplierUpdates } from "@/graphql/contentEditor";
import { ProductContentT, SupplierUpdateAction, SupplierUpdateT } from "@/types/contentEditor.type";
import { entityLabel, fieldLabel } from "@/util/contentLabels";
import { errorCode } from "@/graphql/contentEditorReview";

/** A supplier-update decision staged on the card; sent with the page's Save (UpdateProductContentInput.resolutions). */
export type Resolution = {
  supplierUpdateId: string;
  action: SupplierUpdateAction;
  mergedValue?: unknown;
  expectedSupplierValue: unknown;
};
export type Staged = Record<string, Resolution>;
export const stagedList = (s: Staged) => Object.values(s);

/** The server rejects the whole save when a supplier value moved after the card was shown. */
export const isConflict = (err: any) =>
  errorCode(err) === "SUPPLIER_UPDATE_CHANGED" || /SUPPLIER_UPDATE_CHANGED/.test(String(err?.message ?? ""));

/** Toast, refetch the updates and drop staged choices whose supplier value moved. Other form edits are untouched. */
export const handleConflict = async (
  qc: QueryClient,
  productId: string,
  setStaged: (fn: (prev: Staged) => Staged) => void
) => {
  toast.error("Supplier changed this field again; review the new value");
  ["productContent", "contentProducts"].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
  const fresh = await qc.fetchQuery({
    queryKey: ["supplierUpdates", productId],
    queryFn: () => getSupplierUpdates(productId, "PENDING"),
    staleTime: 0,
  });
  setStaged((prev) =>
    Object.fromEntries(
      Object.entries(prev).filter(([id, r]) =>
        fresh.some((u) => u.id === id && JSON.stringify(u.supplierValue ?? null) === JSON.stringify(r.expectedSupplierValue ?? null))
      )
    )
  );
};

export const useSupplierUpdates = (productId: string) =>
  useQuery({
    queryKey: ["supplierUpdates", productId],
    queryFn: () => getSupplierUpdates(productId, "PENDING"),
    refetchOnWindowFocus: false,
  });

export const useProductContent = (productId: string) =>
  useQuery({
    queryKey: ["productContent", productId],
    queryFn: () => getProductContent(productId),
    refetchOnWindowFocus: false,
  });

/** The editor's live entity (product, option or ticket type) and a display name for it. */
const locate = (content: ProductContentT | undefined, su: SupplierUpdateT) => {
  if (!content) return { entity: undefined, name: "" };
  if (su.entityName === "Product") return { entity: content, name: content.name };
  if (su.entityName === "ProductOption") {
    const o = content.productOptions.find((x) => x.id === su.entityId);
    return { entity: o as Record<string, any> | undefined, name: o?.name ?? "" };
  }
  for (const o of content.productOptions) {
    const t = o.ticketTypes.find((x) => x.id === su.entityId);
    if (t) return { entity: t as Record<string, any>, name: `${t.name} (${o.name})` };
  }
  return { entity: undefined, name: "" };
};

const isTextValue = (v: unknown) =>
  v === null || v === undefined || typeof v === "string" || (Array.isArray(v) && v.every((x) => typeof x === "string"));

const toEditable = (v: unknown) => (Array.isArray(v) ? v.join("\n") : ((v as string) ?? ""));
const display = (v: unknown) => (Array.isArray(v) ? (v as string[]).map(toPlain).join("\n") : toPlain(String(v ?? "")));

const CHIP: Record<string, string> = {
  KEEP_MINE: "Will keep mine",
  USE_SUPPLIER: "Will use supplier",
  MERGE: "Will use custom text",
};

const Item = ({ su, live, name, staged, onStage }: {
  su: SupplierUpdateT;
  live: unknown;
  name: string;
  staged?: Resolution;
  onStage: (r: Resolution | null) => void;
}) => {
  const [showOld, setShowOld] = useState(false);
  const asList = Array.isArray(su.supplierValue) || Array.isArray(live);
  const canEdit = su.field !== "image" && su.field !== "media" && isTextValue(live) && isTextValue(su.supplierValue);
  const liveText = toEditable(live);
  const supplierText = toEditable(su.supplierValue);
  const [empty, setEmpty] = useState(false);
  const [final, setFinal] = useState(() =>
    !staged ? "" : staged.action === "KEEP_MINE" ? liveText : staged.action === "USE_SUPPLIER" ? supplierText : toEditable(staged.mergedValue)
  );

  const stage = (action: Resolution["action"], mergedValue?: unknown) =>
    onStage({
      supplierUpdateId: su.id,
      action,
      ...(action === "MERGE" ? { mergedValue } : {}),
      expectedSupplierValue: su.supplierValue,
    });
  const keepMine = () => {
    setEmpty(false);
    setFinal(liveText);
    stage("KEEP_MINE");
  };
  const useSupplier = () => {
    setEmpty(false);
    setFinal(supplierText);
    stage("USE_SUPPLIER");
  };
  const edit = (text: string) => {
    setFinal(text);
    setEmpty(text.trim() === "");
    if (text.trim() === "") onStage(null);
    else if (text === liveText) stage("KEEP_MINE");
    else if (text === supplierText) stage("USE_SUPPLIER");
    else stage("MERGE", asList ? text.split("\n").map((l) => l.trim()).filter(Boolean) : text);
  };
  const undo = () => {
    setEmpty(false);
    setFinal("");
    onStage(null);
  };

  return (
    <li className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-semibold text-gray-900">{fieldLabel(su.field)}</h4>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {entityLabel(su.entityName)}
          {su.entityName !== "Product" && name ? `: ${name}` : ""}
        </span>
        {su.location && <span className="text-xs text-gray-500">{su.location}</span>}
        {staged && (
          <span className="ml-auto flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-medium text-indigo-700">
            {CHIP[staged.action]}
            <button type="button" onClick={undo} className="font-semibold underline">
              Undo
            </button>
          </span>
        )}
      </div>
      {canEdit ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">Your text</p>
            <div className="max-h-64 min-h-[3rem] overflow-auto whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-800">
              {display(live)}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">Supplier new text</p>
            <div className="max-h-64 min-h-[3rem] overflow-auto whitespace-pre-wrap rounded-md border border-amber-200 bg-amber-50 p-2 text-sm text-gray-800">
              {display(su.supplierValue)}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-1 text-xs text-gray-500">Your value, and how it would change with the supplier's new value</p>
          <DiffView field={su.field} hideLabel oldValue={live} newValue={su.supplierValue} />
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowOld(!showOld)}
        className="text-xs font-medium text-indigo-600 hover:underline"
      >
        {showOld ? "Hide" : "Show"} what the supplier changed
      </button>
      {showOld && (
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="mb-1 text-xs text-gray-500">Previous supplier text to new supplier text</p>
          <DiffView field={su.field} hideLabel oldValue={su.baselineValue} newValue={su.supplierValue} />
        </div>
      )}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" onClick={keepMine}>
          Keep mine
        </Button>
        <Button type="button" variant="outline" onClick={useSupplier}>
          Use supplier
        </Button>
      </div>
      {canEdit && (
        <label className="block space-y-1 text-xs font-medium text-gray-500">
          Final text{asList ? " (one item per line)" : ""}
          <textarea
            value={final}
            onChange={(e) => edit(e.target.value)}
            rows={6}
            placeholder="Choose Keep mine or Use supplier, or write your own"
            className="w-full rounded-md border border-gray-300 p-2 text-sm font-normal text-gray-900"
          />
          {empty && (
            <span className="block text-amber-700">Final text cannot be empty</span>
          )}
        </label>
      )}
    </li>
  );
};

const noStaged: Staged = {};

const SupplierUpdatesPanel = ({
  productId,
  staged = noStaged,
  onStage = () => {},
}: {
  productId: string;
  staged?: Staged;
  onStage?: (id: string, r: Resolution | null) => void;
}) => {
  const updates = useSupplierUpdates(productId);
  const content = useProductContent(productId);

  if (updates.isLoading || content.isLoading)
    return <MascotLoader label="Loading supplier updates..." className="min-h-[30vh]" />;
  if (updates.isError || content.isError || !updates.data)
    return (
      <EmptyState title="Could not load supplier updates" description="Please try again.">
        <Button type="button" onClick={() => { updates.refetch(); content.refetch(); }}>
          Retry
        </Button>
      </EmptyState>
    );
  if (!updates.data.length)
    return (
      <EmptyState title="No supplier updates" description="Your edits are up to date with the supplier." />
    );

  return (
    <ul className="space-y-4">
      {updates.data.map((su) => {
        const { entity, name } = locate(content.data, su);
        return (
          <Item
            key={`${su.id}:${JSON.stringify(su.supplierValue ?? null)}`}
            su={su}
            live={entity?.[su.field]}
            name={name}
            staged={staged[su.id]}
            onStage={(r) => onStage(su.id, r)}
          />
        );
      })}
    </ul>
  );
};

export default SupplierUpdatesPanel;
