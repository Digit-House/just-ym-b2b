import { useEffect, useState } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DiffView, { toPlain } from "@/components/DiffView";
import EmptyState from "@/components/EmptyState";
import MascotLoader from "@/components/MascotLoader";
import ModalWrapper from "@/components/ModalWrapper";
import { getProductContent, getSupplierUpdates } from "@/graphql/contentEditor";
import { ContentMediaT, ProductContentT, SupplierUpdateAction, SupplierUpdateT } from "@/types/contentEditor.type";
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

/** Stable anchor id of one field: data-field-key on the field, matched by `~=` so one row can hold several fields. */
export const fieldKey = (entityName: string, entityId: string, field: string) => `${entityName}:${entityId}:${field}`;

/** Scroll to the element and flash a ring for 1.5s. Retries while the tab or package card is still opening. */
export const flashTo = (selector: string, tries = 20) => {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el || el.offsetParent === null) {
    if (tries > 0) setTimeout(() => flashTo(selector, tries - 1), 50);
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  const ring = ["ring-2", "ring-amber-400", "ring-offset-2"];
  el.classList.add(...ring);
  setTimeout(() => el.classList.remove(...ring), 1500);
};
export const flashField = (su: SupplierUpdateT) =>
  flashTo(`[data-field-key~="${fieldKey(su.entityName, su.entityId, su.field)}"]`);
export const flashUpdate = (su: SupplierUpdateT) => flashTo(`[data-update-id="${su.id}"]`);

/** Package that owns an update: the option itself, or the one holding the ticket type. */
export const optionIdOfUpdate = (su: SupplierUpdateT, content?: ProductContentT) =>
  su.entityName === "ProductOption"
    ? su.entityId
    : su.entityName === "Product"
      ? undefined
      : (su.locationIds?.optionId ?? content?.productOptions.find((o) => o.ticketTypes.some((t) => t.id === su.entityId))?.id);

/** Field badge: opens the dialog with this field's pending updates. */
export const SupplierBadge = ({ count, onClick }: { count: number; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
  >
    Supplier change{count > 1 ? ` (${count})` : ""}
  </button>
);

const isTextValue = (v: unknown) =>
  v === null || v === undefined || typeof v === "string" || (Array.isArray(v) && v.every((x) => typeof x === "string"));

const toEditable = (v: unknown) => (Array.isArray(v) ? v.join("\n") : ((v as string) ?? ""));
const display = (v: unknown) => (Array.isArray(v) ? (v as string[]).map(toPlain).join("\n") : toPlain(String(v ?? "")));

const CHIP: Record<string, string> = {
  KEEP_MINE: "Will keep mine",
  USE_SUPPLIER: "Will use supplier",
  MERGE: "Will use custom text",
};

type MediaItem = ContentMediaT & Record<string, unknown>;
const asMedia = (v: unknown): MediaItem[] =>
  Array.isArray(v) ? (v as MediaItem[]).filter((x) => x && typeof x === "object" && x.path) : [];

/** Union of live and supplier gallery, deduped by path: live items first, then new supplier items. Items stay as received. */
const MediaMerge = ({ live, supplier, staged, onPick }: {
  live: MediaItem[];
  supplier: MediaItem[];
  staged?: Resolution;
  onPick: (items: MediaItem[]) => void;
}) => {
  const all = [...live, ...supplier.filter((m) => !live.some((l) => l.path === m.path))].filter(
    (m, i, a) => a.findIndex((x) => x.path === m.path) === i
  );
  const [ticked, setTicked] = useState<Set<string>>(
    () =>
      new Set(
        staged?.action === "MERGE" ? asMedia(staged.mergedValue).map((m) => m.path) : all.map((m) => m.path)
      )
  );
  const toggle = (path: string) => {
    const n = new Set(ticked);
    if (!n.delete(path)) n.add(path);
    setTicked(n);
    if (staged?.action === "MERGE") onPick(all.filter((m) => n.has(m.path)));
  };
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500">Pick the images for the gallery</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {all.map((m) => {
          const isNew = !live.some((l) => l.path === m.path);
          return (
            <label key={m.path} className="relative block cursor-pointer overflow-hidden rounded-lg border border-gray-200">
              <img src={m.path} alt={m.name || "Gallery image"} className="aspect-square w-full object-cover" />
              <input
                type="checkbox"
                checked={ticked.has(m.path)}
                onChange={() => toggle(m.path)}
                aria-label={`Use ${m.name || "image"}`}
                className="absolute left-2 top-2 h-4 w-4"
              />
              {isNew && (
                <span className="absolute bottom-1 right-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  New
                </span>
              )}
            </label>
          );
        })}
      </div>
      {ticked.size === 0 && <p className="text-xs text-amber-700">Gallery will be empty</p>}
      <Button type="button" variant="outline" onClick={() => onPick(all.filter((m) => ticked.has(m.path)))}>
        Use selection
      </Button>
    </div>
  );
};

export const SupplierUpdateCard = ({ su, live, name, staged, onStage, onGoToField, onDone }: {
  su: SupplierUpdateT;
  live: unknown;
  name: string;
  staged?: Resolution;
  onStage: (r: Resolution | null) => void;
  /** Go to the field this update changes. */
  onGoToField?: (su: SupplierUpdateT) => void;
  /** Called after Keep mine or Use supplier. */
  onDone?: () => void;
}) => {
  const [showOld, setShowOld] = useState(false);
  const asList = Array.isArray(su.supplierValue) || Array.isArray(live);
  const isMedia = su.entityName === "Product" && su.field === "media";
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
    onDone?.();
  };
  const useSupplier = () => {
    setEmpty(false);
    setFinal(supplierText);
    stage("USE_SUPPLIER");
    onDone?.();
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
    <li data-update-id={su.id} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-semibold text-gray-900">
          {onGoToField ? (
            <button type="button" onClick={() => onGoToField(su)} className="hover:underline">
              {fieldLabel(su.field)}
            </button>
          ) : (
            fieldLabel(su.field)
          )}
        </h4>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {entityLabel(su.entityName)}
          {su.entityName !== "Product" && name ? `: ${name}` : ""}
        </span>
        {su.location && <span className="text-xs text-gray-500">{su.location}</span>}
        {onGoToField && (
          <button
            type="button"
            onClick={() => onGoToField(su)}
            className="text-xs font-medium text-indigo-600 hover:underline"
          >
            Go to field
          </button>
        )}
        {staged && (
          <span className="ml-auto flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-medium text-indigo-700">
            {isMedia && staged.action === "MERGE" ? "Will use selection" : CHIP[staged.action]}
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
      {isMedia && (
        <MediaMerge
          live={asMedia(live)}
          supplier={asMedia(su.supplierValue)}
          staged={staged}
          onPick={(items) => stage("MERGE", items)}
        />
      )}
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

/** Dialog with the pending update cards of one field. Closes when every one has a Keep mine or Use supplier choice. */
export const SupplierFieldDialog = ({ productId, updates, staged, onStage, onClose, onGoToField }: {
  productId: string;
  updates: SupplierUpdateT[];
  staged: Staged;
  onStage: (id: string, r: Resolution | null) => void;
  onClose: () => void;
  onGoToField: (su: SupplierUpdateT) => void;
}) => {
  const content = useProductContent(productId);
  useEffect(() => {
    if (!updates.length) onClose();
  }, [updates.length, onClose]);
  return (
    <ModalWrapper title="Supplier change" width="lg" onClose={onClose}>
      {content.isLoading ? (
        <MascotLoader label="Loading supplier updates..." className="min-h-[20vh]" />
      ) : content.isError ? (
        <Button type="button" onClick={() => content.refetch()}>
          Retry
        </Button>
      ) : (
        <ul className="space-y-4">
          {updates.map((su) => {
            const { entity, name } = locate(content.data, su);
            return (
              <SupplierUpdateCard
                key={`${su.id}:${JSON.stringify(su.supplierValue ?? null)}`}
                su={su}
                live={entity?.[su.field]}
                name={name}
                staged={staged[su.id]}
                onStage={(r) => onStage(su.id, r)}
                onGoToField={(u) => {
                  onClose();
                  onGoToField(u);
                }}
                onDone={() => updates.every((u) => u.id === su.id || staged[u.id]) && onClose()}
              />
            );
          })}
        </ul>
      )}
    </ModalWrapper>
  );
};

const noStaged: Staged = {};

const SupplierUpdatesPanel = ({
  productId,
  staged = noStaged,
  onStage = () => {},
  onGoToField,
}: {
  productId: string;
  staged?: Staged;
  onStage?: (id: string, r: Resolution | null) => void;
  onGoToField?: (su: SupplierUpdateT) => void;
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
          <SupplierUpdateCard
            key={`${su.id}:${JSON.stringify(su.supplierValue ?? null)}`}
            su={su}
            live={entity?.[su.field]}
            name={name}
            staged={staged[su.id]}
            onStage={(r) => onStage(su.id, r)}
            onGoToField={onGoToField}
          />
        );
      })}
    </ul>
  );
};

export default SupplierUpdatesPanel;
