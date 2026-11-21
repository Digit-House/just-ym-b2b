import { ReactNode, createContext, useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AttentionItem, UnsavedChip, supplierItems } from "@/components/ticket-fields/AttentionBadge";
import { fieldLabel } from "@/util/contentLabels";
import { Switch } from "@/components/ui/switch";
import { FieldFrame, Section, sectionOfField } from "@/pages/content/_components/ContentFields";
import SupplierUpdatesPanel, {
  Resolution,
  Staged,
  SupplierBadge,
  SupplierFieldDialog,
  fieldKey,
  optionIdOfUpdate,
  flashField,
  flashUpdate,
  useProductContent,
  useSupplierUpdates,
} from "@/pages/content/_components/SupplierUpdatesPanel";
import { setAlwaysReviewFields } from "@/graphql/contentEditorReview";
import { AuditChangeT, AuditSaveT, ProductContentT, SupplierUpdateT } from "@/types/contentEditor.type";
import { getErrMsg } from "@/util/initData";

const DIFF_KEY = "contentDiffView"; // same key as the editor form: one toggle per browser (D10)

/** Owner form tab id of the section that owns an update; option and ticket type updates belong to Pricing & Packages. */
const OWNER_TAB: Record<Section, string> = {
  basic: "basic-info",
  details: "details",
  location: "location",
  media: "media",
  hours: "operating-hours",
  related: "relatedTickets",
};
const ownerTabOfField = (entityName: string, field: string) =>
  entityName === "Product" ? OWNER_TAB[sectionOfField(field)] : "options";
export const ownerTabOf = (su: SupplierUpdateT) => ownerTabOfField(su.entityName, su.field);

const isDirty = (v: any): boolean =>
  v === true || (Array.isArray(v) ? v.some(isDirty) : !!v && typeof v === "object" && Object.values(v).some(isDirty));

/**
 * Everything that needs attention on the owner form: pending supplier updates (a staged choice counts as
 * unsaved, not pending) and fields changed in the form, read from react-hook-form dirtyFields (vs initialValues).
 */
export const ownerAttention = ({ productId, updates, staged, dirtyFields, options, content }: {
  productId: string;
  updates: SupplierUpdateT[];
  staged: Staged;
  dirtyFields: any;
  options: any[] | undefined;
  content?: ProductContentT;
}): AttentionItem[] => {
  const out = supplierItems(updates, staged, ownerTabOf, (su) => optionIdOfUpdate(su, content));
  const add = (entityName: string, entityId: string, field: string, optionId?: string | null) =>
    out.push({
      kind: "unsaved",
      tab: ownerTabOfField(entityName, field),
      optionId,
      entityName,
      entityId,
      field,
      label: fieldLabel(field),
    });
  Object.entries(dirtyFields ?? {}).forEach(([k, v]) => k !== "productOptions" && isDirty(v) && add("Product", productId, k));
  ((dirtyFields?.productOptions as any[]) ?? []).forEach((od, i) => {
    const o = options?.[i];
    if (!o?.id || !od) return;
    Object.entries(od).forEach(([k, v]) => {
      if (k !== "ticketTypes") return isDirty(v) && add("ProductOption", o.id, k, o.id);
      (v as any[]).forEach((td, j) => {
        const t = o.ticketTypes?.[j];
        if (t && td) Object.entries(td).forEach(([tk, tv]) => isDirty(tv) && add("TicketType", t.ticketTypeId, tk, o.id));
      });
    });
  });
  return out;
};

type Value = {
  content?: ProductContentT;
  updates: SupplierUpdateT[];
  staged: Staged;
  /** Everything that needs attention (supplier and unsaved), built by the form. */
  items: AttentionItem[];
  /** Package to open (set by Go to field); `n` makes a repeat request a new value. */
  focus: { optionId: string; n: number } | null;
  openUpdates: (updates: SupplierUpdateT[]) => void;
  goTo: (su: SupplierUpdateT) => void;
  diff: boolean;
  setDiff: (on: boolean) => void;
  always: { isPending: boolean; mutate: (v: { entityName: string; entityId: string; fields: string[] }) => void };
  onShowPending: (su?: SupplierUpdateT) => void;
  /** Saved-version page: read-only, Before/After. */
  locked?: boolean;
};
const Ctx = createContext<Value | null>(null);

/** True on the saved-version page: no editing, no actions. */
export const useLocked = () => !!useContext(Ctx)?.locked;

export const useOwnerReview = () => useContext(Ctx);

const useValue = (productId: string) => {
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
  return { content: content.data, updates: updates.data ?? [], diff, setDiff, always };
};

/** Gives the owner ticket form the diff-view toggle and the per-field "Always review" switch (D10, D13). */
const LiveProvider = ({ productId, setTab, staged = {}, onStage = () => {}, items, children }: ProviderProps) => {
  const base = useValue(productId);
  const [dialogIds, setDialogIds] = useState<string[] | null>(null);
  const [focus, setFocus] = useState<Value["focus"]>(null);
  const goTo = (su: SupplierUpdateT) => {
    setTab(ownerTabOf(su));
    const optionId = su.entityName === "ProductOption" ? su.entityId : su.locationIds?.optionId;
    if (su.entityName !== "Product" && optionId) setFocus({ optionId, n: Date.now() });
    flashField(su);
  };
  const value: Value = {
    ...base,
    staged,
    items,
    focus,
    goTo,
    openUpdates: (us) => setDialogIds(us.map((u) => u.id)),
    onShowPending: (su) => {
      setTab("supplier-updates");
      if (su) flashUpdate(su);
    },
  };
  return (
    <Ctx.Provider value={value}>
      {children}
      {dialogIds && (
        <SupplierFieldDialog
          productId={productId}
          updates={base.updates.filter((u) => dialogIds.includes(u.id))}
          staged={staged}
          onStage={onStage}
          onClose={() => setDialogIds(null)}
          onGoToField={goTo}
        />
      )}
    </Ctx.Provider>
  );
};

type ProviderProps = {
  productId: string;
  setTab: (id: string) => void;
  items: AttentionItem[];
  /** Supplier-update choices staged by the page; the field dialog edits them. */
  staged?: Staged;
  onStage?: (id: string, r: Resolution | null) => void;
  children: ReactNode;
};

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
  // Each field this save changed, on its tab and package card (indigo dot + count).
  const optionOfTicketType = (id: string) =>
    (ticket.productOptions ?? []).find((o: any) => (o.ticketType ?? []).some((t: any) => t.id === id))?.id;
  const items = save.changes.flatMap((c) => {
    const o = c.oldValues ?? {};
    const n = c.newValues ?? {};
    const optionId =
      c.entityName === "Product" ? undefined : c.entityName === "ProductOption" ? c.entityId : optionOfTicketType(c.entityId ?? "");
    return [...new Set([...Object.keys(o), ...Object.keys(n)])]
      .filter((k) => !same(o[k], n[k]))
      .map((k): AttentionItem => ({
        kind: "saved",
        tab: ownerTabOfField(c.entityName, k),
        optionId,
        entityName: c.entityName,
        entityId: c.entityId ?? "",
        field: k,
        label: fieldLabel(k),
      }));
  });
  const value: Value = {
    content,
    updates: [],
    staged: {},
    items,
    focus: null,
    goTo: () => {},
    openUpdates: () => {},
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
        entityName: entity,
        entityId: id,
        updates: v.updates.filter((u) => u.entityId === id && !v.staged[u.id]),
        dirty: (() => {
          const mine = v.items.filter((i) => i.kind === "unsaved" && i.entityName === entity && i.entityId === id);
          // any edit on a ticket type marks its row, which only has the name control
          return entity === "TicketType" && mine.length ? names : mine.map((i) => i.field);
        })(),
        onOpenUpdates: v.openUpdates,
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

/** Anchor and badge for a control that has no ReviewField (owner media tab). */
export const OwnerFieldBox = ({ entityId, fields, children }: { entityId: string; fields: string[]; children: ReactNode }) => {
  const v = useContext(Ctx);
  const us = (v?.updates ?? []).filter((u) => u.entityName === "Product" && fields.includes(u.field) && !v!.staged[u.id]);
  const unsaved = (v?.items ?? []).some((i) => i.kind === "unsaved" && i.entityName === "Product" && fields.includes(i.field));
  return (
    <div data-field-key={fields.map((f) => fieldKey("Product", entityId, f)).join(" ")} className="space-y-3">
      {(us.length > 0 || unsaved) && (
        <div className="flex items-center justify-end gap-2">
          {us.length > 0 && <SupplierBadge count={us.length} onClick={() => v!.openUpdates(us)} />}
          {unsaved && <UnsavedChip />}
        </div>
      )}
      {children}
    </div>
  );
};

/** The Supplier updates tab, wired so each row can go to its field. */
export const OwnerUpdatesPanel = ({ productId, staged, onStage }: { productId: string; staged?: Staged; onStage?: (id: string, r: Resolution | null) => void }) => (
  <SupplierUpdatesPanel productId={productId} staged={staged} onStage={onStage} onGoToField={useContext(Ctx)?.goTo} />
);
