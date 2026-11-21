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

const normRich = (value?: string | null): string => {
  let h = new DOMParser().parseFromString(toRichTextHtml(value), "text/html").body.innerHTML;
  h = h.replace(/&nbsp;| /g, " ").replace(/\s+/g, " ").trim();
  // Whitespace around block tags is layout only; around inline tags it is content, so keep that.
  h = h.replace(/\s*(<\/?(?:p|div|ul|ol|li|h[1-6]|br)\b[^>]*>)\s*/g, "$1");
  h = h.replace(/(<br>)+(?=<\/p>)/g, "");
  h = h.replace(/<p>\s*(<br>)?\s*<\/p>/g, "").replace(/(\s*<br>)+\s*$/, "").trim();
  return h.replace(/^<p>((?:(?!<\/?p[ >]).)*)<\/p>$/, "$1").trim();
};

/**
 * True when two rich text values differ only by editor re-serialisation: whitespace, &nbsp;, empty paragraphs,
 * a trailing <br>, or plain text vs the same text in one <p>. Real formatting or paragraph changes still differ.
 */
export const sameRichText = (a?: string | null, b?: string | null): boolean => normRich(a) === normRich(b);
