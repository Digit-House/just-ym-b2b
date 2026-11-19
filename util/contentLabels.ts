// Single place for field labels and audit action wording. Mirrors CONTENT_FIELD_LABELS in the API (content-sync.ts).
const BASE: Record<string, string> = {
  name: "Name",
  description: "Description",
  whatToExpect: "What to expect",
  termsAndConditions: "Terms and conditions",
  highlights: "Highlights",
  inclusions: "Inclusions",
  exclusions: "Exclusions",
  howToUseList: "How to use",
  howToUse: "How to use",
  thingsToNote: "Things to note",
  goodToKnow: "Good to know",
  keywords: "Keywords",
  productKeywords: "Product keywords",
  image: "Image",
  media: "Media",
  location: "Location",
  addressLine: "Address",
  postalCode: "Postal code",
  latitude: "Latitude",
  longitude: "Longitude",
  tourInformation: "Tour information",
  cancellationNotes: "Cancellation notes",
};

export const FIELD_LABELS: Record<string, string> = {
  ...BASE,
  ...Object.fromEntries(
    Object.entries(BASE)
      .filter(([k]) => k !== "name")
      .map(([k, v]) => [`${k}_mm`, `${v} (Myanmar)`])
  ),
  isPublished: "Published",
  dhNetPrice: "Net price",
  dhSellingPrice: "Selling price",
  dhRecommendedSellingPrice: "Recommended selling price",
  dhMinimumSellingPrice: "Minimum selling price",
  deletedAt: "Deleted",
};

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/** "ticketValidity" -> "Ticket validity"; "foo_mm" -> "Foo (Myanmar)". */
export const humanize = (key: string) => {
  const mm = key.endsWith("_mm");
  const base = (mm ? key.slice(0, -3) : key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();
  return titleCase(base) + (mm ? " (Myanmar)" : "");
};

export const fieldLabel = (field: string) => FIELD_LABELS[field] ?? humanize(field);

export const isPriceField = (field: string) => /price/i.test(field);

export const ENTITY_LABELS: Record<string, string> = {
  Product: "Ticket",
  ProductOption: "Option",
  TicketType: "Ticket type",
};

export const entityLabel = (entityName: string) =>
  ENTITY_LABELS[entityName] ?? humanize(entityName);

/** Raw audit action strings the API writes, in dropdown order. */
export const AUDIT_ACTIONS = [
  "UPDATE",
  "SUPPLIER_KEEP_MINE",
  "SUPPLIER_USE_SUPPLIER",
  "SUPPLIER_MERGE",
] as const;

/** Raw action (+ source and entity) -> plain words. The only mapping from API strings to wording. */
export const actionLabel = (action: string, source?: string | null, entityName = "Product") => {
  const entity = entityLabel(entityName).toLowerCase();
  switch (action) {
    case "SUPPLIER_KEEP_MINE":
      return "Kept editor text";
    case "SUPPLIER_USE_SUPPLIER":
      return "Used supplier text";
    case "SUPPLIER_MERGE":
      return "Merged text";
    case "UPDATE":
      return source === "SYNC" ? "Supplier sync updated" : "Edited ticket content";
    default:
      if (/DELETE/.test(action)) return `Soft-deleted ${entity}`;
      if (/RESTORE/.test(action)) return `Restored ${entity}`;
      if (/CREATE/.test(action)) return `Created ${entity}`;
      return source === "SYNC" ? `Supplier sync: ${humanize(action).toLowerCase()}` : humanize(action);
  }
};

export const actionOptionLabel = (action: string) => actionLabel(action, "USER");
