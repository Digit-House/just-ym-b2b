import * as RPNInput from "react-phone-number-input";
import nationalityLabels from "react-phone-number-input/locale/en.json";

export type NationalityOption = { code: string; name: string };

// react-phone-number-input already bundles a full ISO-3166 alpha-2 list with English names —
// reused here instead of hand-rolling a country list or hitting this app's own `countries`
// query, which only has the 2 countries the business operates in (not a nationality list).
export const NATIONALITIES: NationalityOption[] = RPNInput.getCountries()
  .map((code) => ({
    code: code.toLowerCase(),
    name: (nationalityLabels as Record<string, string>)[code] ?? code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
