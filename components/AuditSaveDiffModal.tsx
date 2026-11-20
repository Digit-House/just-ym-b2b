import { ReactNode } from "react";
import { format } from "date-fns";
import InputField from "@/components/InputField";
import ModalWrapper from "@/components/ModalWrapper";
import TextareaField from "@/components/TextareaField";
import {
  BASIC_GROUPS,
  Bind,
  ContentFieldBody,
  DETAIL_GROUPS,
  FieldGroup,
  FieldSpec,
  LOCATION_GROUPS,
  OPTION_GROUPS,
  SectionCard,
} from "@/pages/content/_components/ContentFields";
import { entityLabel, fieldLabel } from "@/util/contentLabels";
import { AuditChangeT, AuditSaveT } from "@/types/contentEditor.type";

type Values = Record<string, unknown>;

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const noop = () => {};
const isPrimitive = (v: unknown) => v == null || ["string", "number", "boolean"].includes(typeof v);

/** Form sections per entity, the same specs the ticket editor uses. Anything else falls to "Other changes". */
const TYPE_GROUP: FieldGroup = {
  title: "Ticket type",
  specs: [
    { f: "name", label: "Name", kind: "input" },
    { f: "customOriginalPrice", label: "Custom original price", kind: "number" },
  ],
};
const GROUPS: Record<string, FieldGroup[]> = {
  Product: [...BASIC_GROUPS, ...DETAIL_GROUPS, ...LOCATION_GROUPS],
  ProductOption: OPTION_GROUPS,
  TicketType: [TYPE_GROUP],
};
const specKeys = (s: FieldSpec) => (s.kind === "terms" ? [s.f, `${s.f}_mm`] : [s.f]);

/** Old (left) | new (right); both cells are inert. The changed side is tinted. */
const Pair = ({ label, changed, left, right }: { label: string; changed: boolean; left: ReactNode; right: ReactNode }) => {
  const cell = (title: string, tint: string, body: ReactNode) => (
    <div className={`min-w-0 space-y-1 rounded-md p-2 ${changed ? tint : "opacity-60"}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{title}</p>
      <fieldset disabled className="min-w-0">
        {body}
      </fieldset>
    </div>
  );
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <div className="grid gap-4 md:grid-cols-2">
        {cell("Old", "bg-red-50 ring-1 ring-red-200", left)}
        {cell("New", "bg-green-50 ring-1 ring-green-200", right)}
      </div>
    </div>
  );
};

/** Disabled input (scalars) or textarea (JSON, pretty-printed) for any value. */
const Plain = ({ k, v }: { k: string; v: unknown }) =>
  isPrimitive(v) ? (
    <InputField aria-label={fieldLabel(k)} readOnly disabled value={v == null ? "" : String(v)} />
  ) : (
    <TextareaField label="" aria-label={fieldLabel(k)} readOnly disabled value={JSON.stringify(v, null, 2)} />
  );

const GenericRow = ({ k, o, n, label }: { k: string; o: Values; n: Values; label?: string }) => (
  <Pair label={label ?? fieldLabel(k)} changed={!same(o[k], n[k])} left={<Plain k={k} v={o[k]} />} right={<Plain k={k} v={n[k]} />} />
);

/** Bind for a spec control: text controls cannot show objects, so those become JSON text. */
const bindOf = (vals: Values, spec: FieldSpec) => (f: string): Bind => {
  const v = vals[f];
  const text = spec.kind === "input" || spec.kind === "area" || spec.kind === "terms";
  return { value: text && !isPrimitive(v) ? JSON.stringify(v) : v, onChange: noop };
};

const SpecRow = ({ spec, o, n }: { spec: FieldSpec; o: Values; n: Values }) => {
  const keys = specKeys(spec);
  return (
    <Pair
      label={spec.label}
      changed={keys.some((k) => !same(o[k], n[k]))}
      left={<ContentFieldBody spec={spec} bind={bindOf(o, spec)} readOnly />}
      right={<ContentFieldBody spec={spec} bind={bindOf(n, spec)} readOnly />}
    />
  );
};

const Unchanged = ({ count, children }: { count: number; children: ReactNode }) => (
  <details>
    <summary className="cursor-pointer text-sm text-gray-500">{count} unchanged (shown muted)</summary>
    <div className="mt-4 divide-y-2 divide-gray-300 [&>*]:py-5 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">{children}</div>
  </details>
);

const ChangeForm = ({ change }: { change: AuditChangeT }) => {
  const o = (change.oldValues ?? {}) as Values;
  const n = (change.newValues ?? {}) as Values;
  const present = (k: string) => k in o || k in n;
  const groups = GROUPS[change.entityName];
  const title = change.entityLabel || entityLabel(change.entityName);
  const covered = new Set<string>();

  const cards = (groups ?? []).map((g) => {
    const rows = g.specs.filter((s) => specKeys(s).some(present));
    rows.forEach((s) => specKeys(s).forEach((k) => covered.add(k)));
    if (!rows.length) return null;
    const isChanged = (s: FieldSpec) => specKeys(s).some((k) => !same(o[k], n[k]));
    const changed = rows.filter(isChanged);
    const rest = rows.filter((s) => !isChanged(s));
    return (
      <SectionCard key={g.title} title={g.title}>
        {changed.map((s) => (
          <SpecRow key={s.f} spec={s} o={o} n={n} />
        ))}
        {rest.length > 0 && (
          <Unchanged count={rest.length}>
            {rest.map((s) => (
              <SpecRow key={s.f} spec={s} o={o} n={n} />
            ))}
          </Unchanged>
        )}
      </SectionCard>
    );
  });

  // No form control (status, publish, prices, owner-only fields), or a non-ticket entity: every key, inert.
  const other = [...new Set([...Object.keys(o), ...Object.keys(n)])].filter((k) => !covered.has(k));

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {cards}
      {other.length > 0 && (
        <SectionCard title={groups ? "Other changes" : title}>
          {other.map((k) => (
            <GenericRow key={k} k={k} o={o} n={n} />
          ))}
        </SectionCard>
      )}
    </div>
  );
};

/** Changes with no control on the ticket form (status, prices, owner-only fields): the "Other changes" card. */
export const OtherChanges = ({ save }: { save: AuditSaveT }) => {
  const rows = save.changes.flatMap((c) => {
    const o = (c.oldValues ?? {}) as Values;
    const n = (c.newValues ?? {}) as Values;
    const covered = new Set((GROUPS[c.entityName] ?? []).flatMap((g) => g.specs.flatMap(specKeys)));
    const keys = [...new Set([...Object.keys(o), ...Object.keys(n)])].filter((k) => !covered.has(k));
    const title = c.entityLabel || entityLabel(c.entityName);
    return keys.map((k) => <GenericRow key={`${c.id}-${k}`} k={k} o={o} n={n} label={`${title} · ${fieldLabel(k)}`} />);
  });
  return rows.length ? <SectionCard title="Other changes">{rows}</SectionCard> : null;
};

/** One save as the real ticket form: locked, old left, new right. No save or mutation is reachable here. */
const AuditSaveDiffModal = ({ save, onClose }: { save: AuditSaveT; onClose: () => void }) => (
  <ModalWrapper
    width="xl"
    onClose={onClose}
    title={`${save.productName ?? "Save"} · ${format(new Date(save.createdAt), "PPp")}`}
  >
    <div className="space-y-8">
      {save.changes.map((c) => (
        <ChangeForm key={c.id} change={c} />
      ))}
    </div>
  </ModalWrapper>
);

export default AuditSaveDiffModal;
