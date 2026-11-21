import { Lock } from "lucide-react";
import InputField from "@/components/InputField";
import TextInput from "@/components/ticket-fields/TextInput";
import NumberInput from "@/components/ticket-fields/NumberInput";
import LongText from "@/components/ticket-fields/LongText";
import RichText from "@/components/ticket-fields/RichText";
import StringListEditor from "@/components/ticket-fields/StringListEditor";
import BilingualListSection, { LIST_ICONS } from "@/components/ticket-fields/BilingualListSection";
import TermsAndConditionsEditor from "@/components/TermsAndConditionsEditor";
import AlwaysReviewSwitch from "@/components/AlwaysReviewSwitch";
import ContentDiffField from "@/components/ContentDiffField";
import { ReviewMetaT, SupplierUpdateT } from "@/types/contentEditor.type";
import { UnsavedChip } from "@/components/ticket-fields/AttentionBadge";
import { SupplierBadge, fieldKey } from "./SupplierUpdatesPanel";

export type Bind<T = any> = { value: T; onChange: (v: T) => void };

export type FieldSpec = {
  f: string;
  label: string;
  kind: "input" | "number" | "area" | "rich" | "list" | "terms";
  placeholder?: string;
};

/** "Enter exclusion (MM)" -> "Add Exclusion MM"; the owner form's button wording. */
const addLabelOf = (placeholder?: string) => {
  const w = (placeholder ?? "Enter item").replace(/^Enter /, "").replace(/ \(MM\)$/, " MM");
  return `Add ${w.charAt(0).toUpperCase()}${w.slice(1)}`;
};

export const ReadOnlyField = ({ label, value }: { label: string; value: unknown }) => (
  <InputField
    label={label}
    value={value === null || value === undefined ? "" : typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
    disabled
    readOnly
  />
);

export const ListField = ({ label, value, onChange, readOnly, placeholder }: { label: string; readOnly?: boolean; placeholder?: string } & Bind<string[]>) => (
  <StringListEditor
    label={label}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    placeholder={placeholder}
    addLabel={addLabelOf(placeholder)}
  />
);

/** Review context of one entity (product, option or ticket type) for its fields. */
export type FieldCtx = {
  meta: ReviewMetaT;
  diff: boolean;
  entityName: string;
  entityId: string;
  /** Waiting supplier updates of this entity (staged choices excluded: they count as unsaved). */
  updates: SupplierUpdateT[];
  /** Fields of this entity changed in the form and not saved yet. */
  dirty: string[];
  busy: boolean;
  onToggleAlways: (fields: string[], on: boolean) => void;
  /** Go to the Supplier updates tab, at this update. */
  onShowPending: (su?: SupplierUpdateT) => void;
  /** Open the dialog with these updates. */
  onOpenUpdates: (updates: SupplierUpdateT[]) => void;
  /** Saved-version page: everything read-only, Before/After wording. */
  locked?: boolean;
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
  disabled: disabledProp,
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
  const locked = !!ctx.locked;
  const disabled = disabledProp || locked;
  const f = names[0];
  const on = ctx.meta.alwaysReviewFields.includes(f);
  const edited = ctx.meta.editedFields.includes(f);
  const fieldUpdates = ctx.updates.filter((u) => names.includes(u.field));
  const pending = fieldUpdates.length > 0;
  const unsaved = names.some((n) => ctx.dirty.includes(n));
  const box = boxed && ctx.diff;
  return (
    <div
      data-diff-row={box || undefined}
      data-field-key={names.map((n) => fieldKey(ctx.entityName, ctx.entityId, n)).join(" ")}
      className={
        box
          ? "space-y-4 rounded-xl border border-gray-300 bg-white p-5 shadow-sm"
          : boxed
            ? "flex flex-col gap-3"
            : "space-y-3"
      }
    >
      {/* Header on top in every view; all state chips and actions sit right-aligned, the same on both pages. */}
      <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 ${box ? "border-b-2 border-gray-200 pb-3" : ""}`}>
        {(showLabel || box) && (
          <span className={box ? "text-base font-semibold text-gray-900" : "text-sm font-medium text-gray-900"}>
            {label}
          </span>
        )}
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {edited ? (
            <span className={`${CHIP} bg-indigo-100 text-indigo-700`}>{locked ? "Changed" : "Edited"}</span>
          ) : (
            <span className={`${CHIP} bg-gray-100 text-gray-700`}>{locked ? "Not changed" : "Same as supplier"}</span>
          )}
          {pending && <SupplierBadge count={fieldUpdates.length} onClick={() => ctx.onOpenUpdates(fieldUpdates)} />}
          {unsaved && <UnsavedChip />}
          {!disabled && (
            <AlwaysReviewSwitch
              label={label}
              checked={on}
              disabled={ctx.busy}
              onChange={(v) => ctx.onToggleAlways(names, v)}
            />
          )}
        </div>
      </div>
      {ctx.diff ? (
        <ContentDiffField
          field={f}
          label={label}
          edited={edited}
          baseline={ctx.meta.supplierBaseline?.[f]}
          current={current}
          pending={pending}
          onShowPending={() => ctx.onShowPending(fieldUpdates[0])}
          disabled={disabled}
          locked={locked}
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
      <ContentFieldBody spec={spec} bind={bind} readOnly={disabled || ctx?.locked} />
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
  const common = { "aria-label": spec.label, placeholder: spec.placeholder };
  switch (spec.kind) {
    case "input":
      return <TextInput {...common} value={b.value} onChange={b.onChange} />;
    case "number":
      return <NumberInput {...common} value={b.value} onChange={b.onChange} />;
    case "area":
      return <LongText {...common} value={b.value} onChange={b.onChange} />;
    case "rich":
      return <RichText readOnly={readOnly} value={b.value} onChange={b.onChange} placeholder={spec.placeholder} />;
    case "list": {
      // Only plain string lists are editable; any other stored shape stays read-only.
      const v = b.value ?? [];
      return Array.isArray(v) && v.every((x) => typeof x === "string") ? (
        <ListField label={spec.label} value={v} onChange={b.onChange} readOnly={readOnly} placeholder={spec.placeholder} />
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

/**
 * Field rows of one section. A list and its `_mm` twin render as one English/Myanmar section,
 * each side keeping its own review frame.
 */
export const renderSpecs = (specs: FieldSpec[], bind: (f: string) => Bind, ctx: FieldCtx) => {
  const rows: React.ReactNode[] = [];
  for (let i = 0; i < specs.length; i++) {
    const s = specs[i];
    const mm = specs[i + 1];
    if (s.kind === "list" && mm?.f === `${s.f}_mm`) {
      rows.push(
        <BilingualListSection
          key={s.f}
          title={s.label}
          icon={LIST_ICONS[s.f]}
          en={<ContentField spec={s} bind={bind} ctx={ctx} />}
          mm={<ContentField spec={mm} bind={bind} ctx={ctx} />}
        />,
      );
      i++;
    } else rows.push(<ContentField key={s.f} spec={s} bind={bind} ctx={ctx} />);
  }
  return rows;
};

const withMm = (f: string, label: string, kind: FieldSpec["kind"], placeholder?: string): FieldSpec[] => [
  { f, label, kind, placeholder },
  { f: `${f}_mm`, label: `${label} MM`, kind, placeholder: placeholder && (kind === "list" ? `${placeholder} (MM)` : placeholder) },
];
export const BASIC_FIELDS: FieldSpec[] = [
  { f: "name", label: "Ticket Name", kind: "input", placeholder: "Enter ticket name" },
  { f: "keywords", label: "Keywords", kind: "input", placeholder: "Enter keywords separated by commas" },
  { f: "productKeywords", label: "Product Keywords", kind: "input" },
  { f: "goodToKnow", label: "Good To Know", kind: "area" },
];

export const DETAIL_FIELDS: FieldSpec[] = [
  ...withMm("description", "Description", "area", "Enter a detailed description of the ticket..."),
  ...withMm("whatToExpect", "What To Expect", "area", "Describe what customers can expect from this ticket..."),
  { f: "termsAndConditions", label: "Terms and conditions", kind: "terms" },
  ...withMm("highlights", "Highlights", "list", "Enter highlight"),
  ...withMm("inclusions", "Inclusions", "list", "Enter inclusion"),
  ...withMm("exclusions", "Exclusions", "list", "Enter exclusion"),
  ...withMm("howToUseList", "How to Use", "list", "Enter instruction"),
  ...withMm("thingsToNote", "Things to Note", "list", "Enter note"),
];

export const LOCATION_FIELDS: FieldSpec[] = [
  { f: "location", label: "Location", kind: "input", placeholder: "Enter location" },
  { f: "addressLine", label: "Address Line", kind: "input", placeholder: "Enter address" },
  { f: "postalCode", label: "Postal Code", kind: "input", placeholder: "Enter postal code" },
  { f: "latitude", label: "Latitude", kind: "number" },
  { f: "longitude", label: "Longitude", kind: "number" },
];

export const OPTION_FIELDS: FieldSpec[] = [
  { f: "name", label: "Package Name", kind: "input" },
  ...withMm("description", "Package Description", "rich", "Enter package description..."),
  { f: "termsAndConditions", label: "Terms and conditions", kind: "terms" },
  ...withMm("howToUse", "How to Use", "list", "Enter instruction"),
  ...withMm("inclusions", "Inclusions", "list", "Enter inclusion"),
  ...withMm("exclusions", "Exclusions", "list", "Enter exclusion"),
  { f: "tourInformation", label: "Tour Information", kind: "list", placeholder: "Enter tour information" },
  { f: "cancellationNotes", label: "Cancellation Notes", kind: "list", placeholder: "Enter cancellation note" },
];

/** Every wire field the editor may send, derived from the specs ("terms" covers its _mm twin). */
export const fieldNames = (specs: FieldSpec[]) =>
  specs.flatMap((s) => (s.kind === "terms" ? [s.f, `${s.f}_mm`] : [s.f]));

export type FieldGroup = { title: string; specs: FieldSpec[] };
const group = (title: string, all: FieldSpec[], fs: string[]): FieldGroup => ({
  title,
  specs: all.filter((s) => fs.includes(s.f)),
});

export type Section = "basic" | "details" | "location" | "media" | "related" | "hours";
/** The one field-to-section map; both ticket pages map their tabs from it. */
export const sectionOfField = (f: string): Section =>
  f === "media" || f === "image"
    ? "media"
    : f === "relatedProducts"
      ? "related"
      : f.startsWith("operating")
        ? "hours"
        : DETAIL_FIELDS.some((x) => x.f === f || `${x.f}_mm` === f)
          ? "details"
          : LOCATION_FIELDS.some((x) => x.f === f)
            ? "location"
            : "basic";

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
