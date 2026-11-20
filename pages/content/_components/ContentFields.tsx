import { Lock, Plus, Trash2 } from "lucide-react";
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

export const ListField = ({ label, value, onChange, readOnly }: { label: string; readOnly?: boolean } & Bind<string[]>) => (
  <div className="space-y-2">
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
        {!readOnly && (
        <Button
          type="button"
          variant="outline"
          aria-label={`Remove ${label} ${i + 1}`}
          onClick={() => onChange(value.filter((_, j) => j !== i))}
        >
          <Trash2 size={16} />
        </Button>
        )}
      </div>
    ))}
    {!readOnly && (
      <Button type="button" variant="outline" onClick={() => onChange([...value, ""])}>
        <Plus size={16} /> Add item
      </Button>
    )}
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

/** Section card: small uppercase title; its direct children are field rows split by a bold divider. */
export const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
    <div className="divide-y-2 divide-gray-300 [&>*]:py-5 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">{children}</div>
  </section>
);

/** Muted read-only card: label/value text, not inputs. */
export const InfoCard = ({ title, rows }: { title: string; rows: [string, unknown][] }) => (
  <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
    <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
      <Lock size={12} /> {title}
    </h3>
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs text-gray-500">{k}</dt>
          <dd className="text-sm text-gray-700">
            {v === null || v === undefined || v === "" ? "-" : typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);

const CHIP = "rounded-full px-2 py-0.5 text-xs font-medium";

/**
 * One field row: header line (label, state chip, Always review switch), then the control, with the
 * supplier baseline beside it in diff view. `disabled` locks every input and hides the actions.
 * `showLabel` is off where the control carries its own label (owner form).
 */
export const FieldFrame = ({
  ctx,
  names,
  label,
  current,
  showLabel,
  boxed,
  disabled,
  children,
}: {
  ctx?: FieldCtx;
  /** Wire fields this control edits; the first is the one diffed. */
  names: string[];
  label: string;
  current: unknown;
  showLabel?: boolean;
  /** Owner form: in diff view the row becomes a full-width boxed card with its label in the header. */
  boxed?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  if (!ctx) return <>{children}</>;
  const f = names[0];
  const on = ctx.meta.alwaysReviewFields.includes(f);
  const edited = ctx.meta.editedFields.includes(f);
  const pending = names.some((n) => ctx.pending.has(n));
  const box = boxed && ctx.diff;
  return (
    <div
      data-diff-row={box || undefined}
      className={box ? "space-y-4 rounded-xl border border-gray-300 bg-white p-5 shadow-sm" : "space-y-3"}
    >
      <div
        className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 ${box ? "border-b-2 border-gray-200 pb-3" : ""}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {(showLabel || box) && (
            <span className={box ? "text-base font-semibold text-gray-900" : "text-sm font-medium text-gray-900"}>
              {label}
            </span>
          )}
          {pending ? (
            <span className={`${CHIP} bg-amber-100 text-amber-800`}>Newer supplier value</span>
          ) : edited ? (
            <span className={`${CHIP} bg-indigo-100 text-indigo-700`}>Edited</span>
          ) : (
            <span className={`${CHIP} bg-gray-100 text-gray-500`}>Same as supplier</span>
          )}
        </div>
        {!disabled && (
          <AlwaysReviewSwitch
            label={label}
            checked={on}
            disabled={ctx.busy}
            onChange={(v) => ctx.onToggleAlways(names, v)}
          />
        )}
      </div>
      {ctx.diff ? (
        <ContentDiffField
          field={f}
          label={label}
          edited={edited}
          baseline={ctx.meta.supplierBaseline?.[f]}
          current={current}
          pending={pending}
          onShowPending={ctx.onShowPending}
          disabled={disabled}
          stack={box && names.length > 1}
        >
          {children}
        </ContentDiffField>
      ) : (
        <fieldset disabled={disabled} className="min-w-0">
          {children}
        </fieldset>
      )}
    </div>
  );
};

/** Renders one editable content field. `bind(field)` returns the value and a change handler for it. */
export const ContentField = ({
  spec,
  bind,
  ctx,
  disabled,
}: {
  spec: FieldSpec;
  bind: (field: string) => Bind;
  ctx?: FieldCtx;
  disabled?: boolean;
}) => {
  const b = bind(spec.f);
  return (
    <FieldFrame
      ctx={ctx}
      names={spec.kind === "terms" ? [spec.f, `${spec.f}_mm`] : [spec.f]}
      label={spec.label}
      current={b.value}
      showLabel
      disabled={disabled}
    >
      <ContentFieldBody spec={spec} bind={bind} />
    </FieldFrame>
  );
};

export const ContentFieldBody = ({
  spec,
  bind,
  readOnly,
}: {
  spec: FieldSpec;
  bind: (field: string) => Bind;
  /** Terms editors are contenteditable (`fieldset disabled` cannot lock them); list Add/Remove buttons are hidden. */
  readOnly?: boolean;
}) => {
  const b = bind(spec.f);
  switch (spec.kind) {
    case "input":
      return (
        <InputField aria-label={spec.label} value={b.value ?? ""} onChange={(e) => b.onChange(e.target.value)} />
      );
    case "number":
      return (
        <InputField
          aria-label={spec.label}
          type="number"
          value={b.value ?? ""}
          onChange={(e) => b.onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );
    case "area":
      return (
        <TextareaField label="" aria-label={spec.label} value={b.value ?? ""} onChange={(e) => b.onChange(e.target.value)} />
      );
    case "list": {
      // Only plain string lists are editable; any other stored shape stays read-only.
      const v = b.value ?? [];
      return Array.isArray(v) && v.every((x) => typeof x === "string") ? (
        <ListField label={spec.label} value={v} onChange={b.onChange} readOnly={readOnly} />
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
          readOnly={readOnly}
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

export type FieldGroup = { title: string; specs: FieldSpec[] };
const group = (title: string, all: FieldSpec[], fs: string[]): FieldGroup => ({
  title,
  specs: all.filter((s) => fs.includes(s.f)),
});

export const BASIC_GROUPS = [
  group("Text", BASIC_FIELDS, ["name", "goodToKnow"]),
  group("Search", BASIC_FIELDS, ["keywords", "productKeywords"]),
];
export const DETAIL_GROUPS = [
  group("Description", DETAIL_FIELDS, ["description", "description_mm", "whatToExpect", "whatToExpect_mm"]),
  group("Terms", DETAIL_FIELDS, ["termsAndConditions"]),
  group("Lists", DETAIL_FIELDS, [
    ...["highlights", "inclusions", "exclusions", "howToUseList", "thingsToNote"].flatMap((f) => [f, `${f}_mm`]),
  ]),
];
export const LOCATION_GROUPS = [
  group("Address", LOCATION_FIELDS, ["location", "addressLine", "postalCode"]),
  group("Coordinates", LOCATION_FIELDS, ["latitude", "longitude"]),
];
export const OPTION_GROUPS = [
  group("Text", OPTION_FIELDS, ["name", "description", "description_mm"]),
  group("Terms", OPTION_FIELDS, ["termsAndConditions"]),
  group("Lists", OPTION_FIELDS, [
    ...["howToUse", "inclusions", "exclusions"].flatMap((f) => [f, `${f}_mm`]),
    "tourInformation",
    "cancellationNotes",
  ]),
];
