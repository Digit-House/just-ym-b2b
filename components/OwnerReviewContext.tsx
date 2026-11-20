import { ReactNode, createContext, useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { FieldFrame } from "@/pages/content/_components/ContentFields";
import { useProductContent, useSupplierUpdates } from "@/pages/content/_components/SupplierUpdatesPanel";
import { setAlwaysReviewFields } from "@/graphql/contentEditorReview";
import { AuditChangeT, AuditSaveT, ProductContentT } from "@/types/contentEditor.type";
import { getErrMsg } from "@/util/initData";

const DIFF_KEY = "contentDiffView"; // same key as the editor form: one toggle per browser (D10)

type Value = {
  content?: ProductContentT;
  updates: { entityId: string; field: string }[];
  diff: boolean;
  setDiff: (on: boolean) => void;
  always: { isPending: boolean; mutate: (v: { entityName: string; entityId: string; fields: string[] }) => void };
  onShowPending: () => void;
  /** Saved-version page: read-only, Before/After. */
  locked?: boolean;
};
const Ctx = createContext<Value | null>(null);

/** True on the saved-version page: no editing, no actions. */
export const useLocked = () => !!useContext(Ctx)?.locked;

const useValue = (productId: string, onShowPending: () => void): Value => {
  const qc = useQueryClient();
  const content = useProductContent(productId);
  const updates = useSupplierUpdates(productId);
  const [diff, setDiffState] = useState(() => localStorage.getItem(DIFF_KEY) === "1");
  const setDiff = (on: boolean) => {
    setDiffState(on);
    localStorage.setItem(DIFF_KEY, on ? "1" : "0");
  };
  const always = useMutation({
    mutationFn: (v: { entityName: string; entityId: string; fields: string[] }) =>
      setAlwaysReviewFields(v.entityName, v.entityId, v.fields),
    onSuccess: () => ["productContent", "auditLogs"].forEach((k) => qc.invalidateQueries({ queryKey: [k] })),
    onError: (err) => toast.error(getErrMsg(err as any, "message")),
  });
  return { content: content.data, updates: updates.data ?? [], diff, setDiff, always, onShowPending };
};

/** Gives the owner ticket form the diff-view toggle and the per-field "Always review" switch (D10, D13). */
const LiveProvider = ({ productId, onShowPending, children }: ProviderProps) => (
  <Ctx.Provider value={useValue(productId, onShowPending)}>{children}</Ctx.Provider>
);

type ProviderProps = { productId: string; onShowPending: () => void; children: ReactNode };

/** An outer SaveDiffProvider wins: the form then reads the saved version, not the live review queries. */
export const OwnerReviewProvider = (props: ProviderProps) =>
  useContext(Ctx) ? <>{props.children}</> : <LiveProvider {...props} />;

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/** Review meta of one entity as saved: edited = keys this save changed, baseline = old values. */
const metaOf = (changes: AuditChangeT[]) => {
  const o = Object.assign({}, ...changes.map((c) => c.oldValues ?? {}));
  const n = Object.assign({}, ...changes.map((c) => c.newValues ?? {}));
  const keys = [...new Set([...Object.keys(o), ...Object.keys(n)])];
  return { editedFields: keys.filter((k) => !same(o[k], n[k])), alwaysReviewFields: [] as string[], supplierBaseline: o };
};

/**
 * Feeds the ticket form one saved version (D-r3): diff always on, edited = fields this save changed,
 * baseline = old values, locked. `ticket` lists the entities so unchanged ones read "Not changed".
 */
export const SaveDiffProvider = ({
  ticket,
  save,
  children,
}: {
  ticket: any;
  save: AuditSaveT;
  children: ReactNode;
}) => {
  const of = (name: string, id?: string | null) =>
    metaOf(save.changes.filter((c) => c.entityName === name && (name === "Product" || c.entityId === id)));
  const content = {
    id: ticket.id,
    name: ticket.name,
    media: [],
    pendingSupplierUpdates: 0,
    ...of("Product"),
    productOptions: (ticket.productOptions ?? []).map((o: any) => ({
      id: o.id,
      name: o.name,
      pendingSupplierUpdates: 0,
      ...of("ProductOption", o.id),
      ticketTypes: (o.ticketType ?? []).map((t: any) => ({
        id: t.id,
        name: t.name,
        pendingSupplierUpdates: 0,
        ...of("TicketType", t.id),
      })),
    })),
  } as ProductContentT;
  const value: Value = {
    content,
    updates: [],
    diff: true,
    setDiff: () => {},
    always: { isPending: false, mutate: () => {} },
    onShowPending: () => {},
    locked: true,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const DiffToggle = () => {
  const v = useContext(Ctx);
  if (!v || v.locked) return null;
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
      <Switch checked={v.diff} onCheckedChange={v.setDiff} aria-label="Diff view" />
      Diff view
    </label>
  );
};

type Entity = "Product" | "ProductOption" | "TicketType";

/**
 * Wraps one form control: adds "Always review" and, in diff view, the supplier baseline on the left.
 * `current` is the live form value. Renders the bare control until the review data has loaded.
 */
export const ReviewField = ({
  entity = "Product",
  entityId,
  names,
  label,
  current,
  children,
}: {
  entity?: Entity;
  entityId?: string;
  names: string[];
  label: string;
  current: unknown;
  children: ReactNode;
}) => {
  const v = useContext(Ctx);
  const c = v?.content;
  if (!v || !c) return <>{children}</>;
  let meta: any;
  if (entity === "Product") meta = c;
  else if (entity === "ProductOption") meta = c.productOptions.find((o) => o.id === entityId);
  else meta = c.productOptions.flatMap((o) => o.ticketTypes).find((t) => t.id === entityId);
  if (!meta) return <>{children}</>;
  const id = entity === "Product" ? c.id : entityId!;
  const have = meta.alwaysReviewFields ?? [];
  return (
    <FieldFrame
      boxed
      names={names}
      label={label}
      current={current}
      ctx={{
        meta: { ...meta, editedFields: meta.editedFields ?? [], alwaysReviewFields: have },
        diff: v.diff,
        pending: new Set(v.updates.filter((u) => u.entityId === id).map((u) => u.field)),
        busy: v.always.isPending,
        locked: v.locked,
        onShowPending: v.onShowPending,
        onToggleAlways: (ns, on) =>
          v.always.mutate({
            entityName: entity,
            entityId: id,
            fields: on ? Array.from(new Set([...have, ...ns])) : have.filter((f: string) => !ns.includes(f)),
          }),
      }}
    >
      {children}
    </FieldFrame>
  );
};
