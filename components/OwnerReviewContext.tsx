import { ReactNode, createContext, useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { FieldFrame } from "@/pages/content/_components/ContentFields";
import { useProductContent, useSupplierUpdates } from "@/pages/content/_components/SupplierUpdatesPanel";
import { setAlwaysReviewFields } from "@/graphql/contentEditorReview";
import { getErrMsg } from "@/util/initData";

const DIFF_KEY = "contentDiffView"; // same key as the editor form: one toggle per browser (D10)

type Value = ReturnType<typeof useValue>;
const Ctx = createContext<Value | null>(null);

const useValue = (productId: string, onShowPending: () => void) => {
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
export const OwnerReviewProvider = ({
  productId,
  onShowPending,
  children,
}: {
  productId: string;
  onShowPending: () => void;
  children: ReactNode;
}) => <Ctx.Provider value={useValue(productId, onShowPending)}>{children}</Ctx.Provider>;

export const DiffToggle = () => {
  const v = useContext(Ctx);
  if (!v) return null;
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
      names={names}
      label={label}
      current={current}
      ctx={{
        meta: { ...meta, editedFields: meta.editedFields ?? [], alwaysReviewFields: have },
        diff: v.diff,
        pending: new Set(v.updates.filter((u) => u.entityId === id).map((u) => u.field)),
        busy: v.always.isPending,
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
