import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DiffView, { toPlain } from "@/components/DiffView";
import EmptyState from "@/components/EmptyState";
import MascotLoader from "@/components/MascotLoader";
import {
  getProductContent,
  getSupplierUpdates,
  resolveSupplierUpdate,
} from "@/graphql/contentEditor";
import { ProductContentT, SupplierUpdateAction, SupplierUpdateT } from "@/types/contentEditor.type";
import { entityLabel, fieldLabel } from "@/util/contentLabels";
import { getErrMsg } from "@/util/initData";

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

const Item = ({ su, live, name, onResolve, busy }: {
  su: SupplierUpdateT;
  live: unknown;
  name: string;
  busy: boolean;
  onResolve: (action: SupplierUpdateAction, merged?: unknown) => void;
}) => {
  const [showOld, setShowOld] = useState(false);
  const [confirmUse, setConfirmUse] = useState(false);
  const [merging, setMerging] = useState(false);
  const [draft, setDraft] = useState("");
  const asList = Array.isArray(su.supplierValue) || Array.isArray(live);
  const canMerge = su.field !== "image" && su.field !== "media" && isTextValue(live) && isTextValue(su.supplierValue);

  const openMerge = () => {
    setDraft(toEditable(live));
    setMerging(true);
  };
  const submitMerge = () => {
    const merged = asList ? draft.split("\n").map((l) => l.trim()).filter(Boolean) : draft;
    setMerging(false);
    onResolve("MERGE", merged);
  };

  return (
    <li className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-semibold text-gray-900">{fieldLabel(su.field)}</h4>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {entityLabel(su.entityName)}
          {su.entityName !== "Product" && name ? `: ${name}` : ""}
        </span>
      </div>
      <div>
        <p className="mb-1 text-xs text-gray-500">Your text, and how it would change with the supplier's new text</p>
        <DiffView field={su.field} hideLabel oldValue={live} newValue={su.supplierValue} />
      </div>
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
        <Button type="button" variant="outline" disabled={busy} onClick={() => onResolve("KEEP_MINE")}>
          Keep mine
        </Button>
        <Button type="button" variant="outline" disabled={busy} onClick={() => setConfirmUse(true)}>
          Use supplier
        </Button>
        {canMerge && (
          <Button type="button" variant="outline" disabled={busy} onClick={openMerge}>
            Merge
          </Button>
        )}
      </div>

      <Dialog open={confirmUse} onOpenChange={setConfirmUse}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Use the supplier text?</DialogTitle>
            <DialogDescription>
              This replaces your text for "{fieldLabel(su.field)}" with the supplier's. Your text is kept in the history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmUse(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setConfirmUse(false);
                onResolve("USE_SUPPLIER");
              }}
            >
              Use supplier text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={merging} onOpenChange={setMerging}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Merge "{fieldLabel(su.field)}"</DialogTitle>
            <DialogDescription>
              Edit your text using the supplier's new text as a guide.{asList ? " One item per line." : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-medium">
              Your text (edit)
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={12}
                className="w-full rounded-md border border-gray-300 p-2 text-sm font-normal"
              />
            </label>
            <div className="space-y-1 text-sm font-medium">
              Supplier text
              <div className="max-h-[22rem] overflow-auto whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-2 text-sm font-normal text-gray-700">
                {Array.isArray(su.supplierValue)
                  ? (su.supplierValue as string[]).map(toPlain).join("\n")
                  : toPlain(String(su.supplierValue ?? ""))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setMerging(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={submitMerge}>
              Save merged text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
};

const SupplierUpdatesPanel = ({ productId }: { productId: string }) => {
  const qc = useQueryClient();
  const updates = useSupplierUpdates(productId);
  const content = useProductContent(productId);

  const resolve = useMutation({
    mutationFn: (v: { id: string; action: SupplierUpdateAction; merged?: unknown }) =>
      resolveSupplierUpdate(v.id, v.action, v.merged),
    onSuccess: () => {
      toast.success("Supplier update resolved");
      ["supplierUpdates", "productContent", "auditLogs", "contentProducts"].forEach((k) =>
        qc.invalidateQueries({ queryKey: [k] })
      );
    },
    onError: (err) => toast.error(getErrMsg(err as any, "message")),
  });

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
            key={su.id}
            su={su}
            live={entity?.[su.field]}
            name={name}
            busy={resolve.isPending}
            onResolve={(action, merged) => resolve.mutate({ id: su.id, action, merged })}
          />
        );
      })}
    </ul>
  );
};

export default SupplierUpdatesPanel;
