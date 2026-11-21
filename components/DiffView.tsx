import { useState } from "react";
import { diffWords } from "diff";
import { fieldLabel, isPriceField } from "@/util/contentLabels";
import { preFixImg } from "@/util/initData";

type Props = {
  /** Raw field name; rendered as a human label above the diff. */
  field: string;
  oldValue: unknown;
  newValue: unknown;
  /** Prefix for price fields, e.g. "SGD". */
  currency?: string;
  /** Hide the field label when the caller already shows it. */
  hideLabel?: boolean;
  className?: string;
};

const COLLAPSE_AT = 280;

/** Rich text to readable plain text. DOMParser is inert (no scripts or image loads). */
export const toPlain = (value: string) => {
  if (!/[<&]/.test(value)) return value;
  const html = value.replace(/<\s*(br|\/p|\/div|\/li|\/h\d)[^>]*>/gi, "\n");
  const text = new DOMParser().parseFromString(html, "text/html").body.textContent ?? "";
  return text.replace(/\n{3,}/g, "\n\n").trim();
};

const isEmpty = (v: unknown) =>
  v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);

const itemText = (v: unknown) =>
  typeof v === "string" ? toPlain(v) : typeof v === "object" ? JSON.stringify(v) : String(v);

const mediaPath = (v: unknown) =>
  typeof v === "string" ? v : ((v as { path?: string })?.path ?? "");

const formatPrice = (v: unknown, currency?: string) =>
  isEmpty(v) || Number.isNaN(Number(v))
    ? "None"
    : `${currency ? `${currency} ` : ""}${Number(v).toFixed(2)}`;

const formatPlain = (v: unknown, field: string): string => {
  if (isEmpty(v)) return "";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") return v.toLocaleString("en-US", { maximumFractionDigits: 6 });
  if (typeof v === "string" && /At$/.test(field) && !Number.isNaN(Date.parse(v)))
    return new Date(v).toLocaleString();
  return typeof v === "string" ? toPlain(v) : JSON.stringify(v, null, 2);
};

const Thumb = ({ path, caption }: { path: string; caption?: string }) => (
  <figure className="flex flex-col items-center gap-1">
    {path ? (
      <img
        src={preFixImg(path)}
        alt={caption ?? "Image"}
        className="h-20 w-28 rounded-md border border-gray-200 object-cover"
      />
    ) : (
      <div className="flex h-20 w-28 items-center justify-center rounded-md border border-dashed border-gray-300 text-xs text-gray-400">
        None
      </div>
    )}
    {caption && <figcaption className="text-xs text-gray-500">{caption}</figcaption>}
  </figure>
);

const Collapsible = ({ long, children }: { long: boolean; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={!long || open ? "" : "max-h-24 overflow-hidden"}>{children}</div>
      {long && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mt-1 text-xs font-medium text-indigo-600 hover:underline"
        >
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

const TextDiff = ({ a, b }: { a: string; b: string }) => (
  <Collapsible long={a.length + b.length > COLLAPSE_AT}>
    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800">
      {diffWords(a, b).map((p, i) =>
        p.added ? (
          <span key={i} className="rounded bg-green-100 px-0.5 text-green-800">
            {p.value}
          </span>
        ) : p.removed ? (
          <span key={i} className="rounded bg-red-100 px-0.5 text-red-700 line-through">
            {p.value}
          </span>
        ) : (
          <span key={i}>{p.value}</span>
        )
      )}
    </p>
  </Collapsible>
);

const ListDiff = ({ a, b }: { a: unknown[]; b: unknown[] }) => {
  const before = a.map(itemText);
  const after = b.map(itemText);
  const removed = before.filter((x) => !after.includes(x));
  const added = after.filter((x) => !before.includes(x));
  const kept = after.length - added.length;
  return (
    <Collapsible long={removed.length + added.length > 6}>
      <ul className="space-y-1 text-sm">
        {removed.map((x, i) => (
          <li key={`r${i}`} className="rounded bg-red-50 px-2 py-1 text-red-700 line-through">
            {x}
          </li>
        ))}
        {added.map((x, i) => (
          <li key={`a${i}`} className="rounded bg-green-50 px-2 py-1 text-green-800">
            {x}
          </li>
        ))}
        {!removed.length && !added.length && (
          <li className="text-gray-500">Order changed</li>
        )}
        {kept > 0 && (removed.length > 0 || added.length > 0) && (
          <li className="text-xs text-gray-400">
            {kept} unchanged {kept === 1 ? "item" : "items"}
          </li>
        )}
      </ul>
    </Collapsible>
  );
};

const ImageListDiff = ({ a, b }: { a: unknown[]; b: unknown[] }) => {
  const before = a.map(mediaPath);
  const after = b.map(mediaPath);
  const removed = before.filter((x) => !after.includes(x));
  const added = after.filter((x) => !before.includes(x));
  if (!removed.length && !added.length) return <p className="text-sm text-gray-500">Order changed</p>;
  return (
    <div className="flex flex-wrap gap-3">
      {removed.map((p) => (
        <Thumb key={`r${p}`} path={p} caption="Removed" />
      ))}
      {added.map((p) => (
        <Thumb key={`a${p}`} path={p} caption="Added" />
      ))}
    </div>
  );
};

const Body = ({ field, oldValue, newValue, currency }: Omit<Props, "className" | "hideLabel">) => {
  if (field === "image")
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Thumb path={String(oldValue ?? "")} caption="Before" />
        <span className="text-gray-400">&rarr;</span>
        <Thumb path={String(newValue ?? "")} caption="After" />
      </div>
    );
  if (field === "media" || (Array.isArray(newValue) && typeof newValue[0] === "object" && "path" in (newValue[0] as object)))
    return (
      <ImageListDiff
        a={Array.isArray(oldValue) ? oldValue : []}
        b={Array.isArray(newValue) ? newValue : []}
      />
    );
  if (isPriceField(field))
    return (
      <p className="text-sm text-gray-800">
        <span className="text-red-700 line-through">{formatPrice(oldValue, currency)}</span>
        <span className="mx-2 text-gray-400">&rarr;</span>
        <span className="font-medium text-green-800">{formatPrice(newValue, currency)}</span>
      </p>
    );
  if (Array.isArray(oldValue) || Array.isArray(newValue))
    return (
      <ListDiff
        a={Array.isArray(oldValue) ? oldValue : isEmpty(oldValue) ? [] : [oldValue]}
        b={Array.isArray(newValue) ? newValue : isEmpty(newValue) ? [] : [newValue]}
      />
    );
  return <TextDiff a={formatPlain(oldValue, field)} b={formatPlain(newValue, field)} />;
};

/** Shared diff row: audit history and supplier updates render through this one component. */
const DiffView = ({ field, hideLabel, className = "", ...rest }: Props) => (
  <div className={`space-y-2 ${className}`}>
    {!hideLabel && (
      <p className="text-sm font-semibold text-gray-800">
        {fieldLabel(field)}
      </p>
    )}
    <Body field={field} {...rest} />
  </div>
);

export default DiffView;
