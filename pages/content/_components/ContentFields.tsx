import { Plus, Trash2 } from "lucide-react";
import InputField from "@/components/InputField";
import TextareaField from "@/components/TextareaField";
import TermsAndConditionsEditor from "@/components/TermsAndConditionsEditor";
import { Button } from "@/components/ui/button";
import AlwaysReviewSwitch from "@/components/AlwaysReviewSwitch";
import ContentDiffField from "@/components/ContentDiffField";
import { ReviewMetaT } from "@/types/contentEditor.type";

export type Bind<T = any> = { value: T; onChange: (v: T) => void };

export type FieldSpec = {
  f: string;
  label: string;
  kind: "input" | "number" | "area" | "list" | "terms";
};

export const ReadOnlyField = ({ label, value }: { label: string; value: unknown }) => (
  <InputField
    label={label}
    value={value === null || value === undefined ? "" : typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
    disabled
    readOnly
  />
);

export const ListField = ({ label, value, onChange }: { label: string } & Bind<string[]>) => (
  <div className="space-y-2">
    <p className="text-sm font-medium">{label}</p>
    {value.map((item, i) => (
      <div key={i} className="flex items-start gap-2">
        <div className="flex-1">
          <TextareaField
            label=""
            aria-label={`${label} ${i + 1}`}
            value={item}
            onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          aria-label={`Remove ${label} ${i + 1}`}
          onClick={() => onChange(value.filter((_, j) => j !== i))}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    ))}
    <Button type="button" variant="outline" onClick={() => onChange([...value, ""])}>
      <Plus size={16} /> Add item
    </Button>
  </div>
);

/** Review context of one entity (product, option or ticket type) for its fields. */
export type FieldCtx = {
  meta: ReviewMetaT;
  diff: boolean;
  /** Fields with a waiting supplier update. */
  pending: Set<string>;
  busy: boolean;
  onToggleAlways: (fields: string[], on: boolean) => void;
  onShowPending: () => void;
};

/** Adds the "Always review" switch and, in diff view, the supplier baseline beside the control. */
export const FieldFrame = ({
  ctx,
  names,
  label,
  current,
  children,
}: {
  ctx?: FieldCtx;
  /** Wire fields this control edits; the first is the one diffed. */
  names: string[];
  label: string;
  current: unknown;
  children: React.ReactNode;
}) => {
  if (!ctx) return <>{children}</>;
  const f = names[0];
  const on = ctx.meta.alwaysReviewFields.includes(f);
  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <AlwaysReviewSwitch
          label={label}
          checked={on}
          disabled={ctx.busy}
          onChange={(v) => ctx.onToggleAlways(names, v)}
        />
      </div>
      {ctx.diff ? (
        <ContentDiffField
          field={f}
          label={label}
          edited={ctx.meta.editedFields.includes(f)}
          baseline={ctx.meta.supplierBaseline?.[f]}
          current={current}
          pending={names.some((n) => ctx.pending.has(n))}
          onShowPending={ctx.onShowPending}
        >
          {children}
        </ContentDiffField>
      ) : (
        children
      )}
    </div>
  );
};

/** Renders one editable content field. `bind(field)` returns the value and a change handler for it. */
export const ContentField = ({
  spec,
  bind,
  ctx,
}: {
  spec: FieldSpec;
  bind: (field: string) => Bind;
  ctx?: FieldCtx;
}) => {
  const b = bind(spec.f);
  return (
    <FieldFrame
      ctx={ctx}
      names={spec.kind === "terms" ? [spec.f, `${spec.f}_mm`] : [spec.f]}
      label={spec.label}
      current={b.value}
    >
      <ContentFieldBody spec={spec} bind={bind} />
    </FieldFrame>
  );
};

const ContentFieldBody = ({ spec, bind }: { spec: FieldSpec; bind: (field: string) => Bind }) => {
  const b = bind(spec.f);
  switch (spec.kind) {
    case "input":
      return (
        <InputField label={spec.label} value={b.value ?? ""} onChange={(e) => b.onChange(e.target.value)} />
      );
    case "number":
      return (
        <InputField
          label={spec.label}
          type="number"
          value={b.value ?? ""}
          onChange={(e) => b.onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );
    case "area":
      return (
        <TextareaField label={spec.label} value={b.value ?? ""} onChange={(e) => b.onChange(e.target.value)} />
      );
    case "list": {
      // Only plain string lists are editable; any other stored shape stays read-only.
      const v = b.value ?? [];
      return Array.isArray(v) && v.every((x) => typeof x === "string") ? (
        <ListField label={spec.label} value={v} onChange={b.onChange} />
      ) : (
        <ReadOnlyField label={`${spec.label} (not editable)`} value={JSON.stringify(v)} />
      );
    }
    case "terms": {
      const mm = bind(`${spec.f}_mm`);
      return (
        <TermsAndConditionsEditor
          englishValue={b.value ?? ""}
          myanmarValue={mm.value ?? ""}
          onEnglishChange={b.onChange}
          onMyanmarChange={mm.onChange}
        />
      );
    }
  }
};

const withMm = (f: string, label: string, kind: FieldSpec["kind"]): FieldSpec[] => [
  { f, label, kind },
  { f: `${f}_mm`, label: `${label} (Myanmar)`, kind },
];

export const BASIC_FIELDS: FieldSpec[] = [
  { f: "name", label: "Name", kind: "input" },
  { f: "keywords", label: "Keywords", kind: "input" },
  { f: "productKeywords", label: "Product keywords", kind: "input" },
  { f: "goodToKnow", label: "Good to know", kind: "area" },
];

export const DETAIL_FIELDS: FieldSpec[] = [
  ...withMm("description", "Description", "area"),
  ...withMm("whatToExpect", "What to expect", "area"),
  { f: "termsAndConditions", label: "Terms and conditions", kind: "terms" },
  ...withMm("highlights", "Highlights", "list"),
  ...withMm("inclusions", "Inclusions", "list"),
  ...withMm("exclusions", "Exclusions", "list"),
  ...withMm("howToUseList", "How to use", "list"),
  ...withMm("thingsToNote", "Things to note", "list"),
];

export const LOCATION_FIELDS: FieldSpec[] = [
  { f: "location", label: "Location", kind: "input" },
  { f: "addressLine", label: "Address", kind: "input" },
  { f: "postalCode", label: "Postal code", kind: "input" },
  { f: "latitude", label: "Latitude", kind: "number" },
  { f: "longitude", label: "Longitude", kind: "number" },
];

export const OPTION_FIELDS: FieldSpec[] = [
  { f: "name", label: "Name", kind: "input" },
  ...withMm("description", "Description", "area"),
  { f: "termsAndConditions", label: "Terms and conditions", kind: "terms" },
  ...withMm("howToUse", "How to use", "list"),
  ...withMm("inclusions", "Inclusions", "list"),
  ...withMm("exclusions", "Exclusions", "list"),
  { f: "tourInformation", label: "Tour information", kind: "list" },
  { f: "cancellationNotes", label: "Cancellation notes", kind: "list" },
];

/** Every wire field the editor may send, derived from the specs ("terms" covers its _mm twin). */
export const fieldNames = (specs: FieldSpec[]) =>
  specs.flatMap((s) => (s.kind === "terms" ? [s.f, `${s.f}_mm`] : [s.f]));
