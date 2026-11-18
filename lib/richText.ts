/** True when the string already contains HTML tags (e.g. output of the rich text editor). */
export const isHtml = (value?: string | null): boolean =>
  !!value && /<\/?[a-z][\s\S]*?>/i.test(value);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Turns plain text (e.g. supplier-seeded descriptions with "\n" line breaks)
 * into HTML so line breaks survive in the rich text editor and on display.
 * HTML input is returned unchanged.
 */
export const toRichTextHtml = (value?: string | null): string => {
  if (!value) return "";
  if (isHtml(value)) return value;
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
};
