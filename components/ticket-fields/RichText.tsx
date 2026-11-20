import RichTextEditor from "@/components/RichTextEditor";
import { sameRichText, toRichTextHtml } from "@/lib/richText";

/** Rich text: the value stays an HTML string (legacy plain text is converted on read). */
const RichText = ({
  label,
  value,
  onChange,
  readOnly,
  placeholder,
  errMsg,
}: {
  label?: string;
  value: string | null | undefined;
  onChange: (html: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  errMsg?: string;
}) => (
  <div className="flex flex-col gap-2">
    {label && <span className="own-label block text-sm font-medium">{label}</span>}
    <RichTextEditor
      readOnly={readOnly}
      value={toRichTextHtml(value)}
      // Jodit re-serialises on blur; only a real content change counts as an edit.
      onChange={(html) => !sameRichText(html, value) && onChange(html)}
      placeholder={placeholder ?? (label ? `Enter ${label.toLowerCase()}...` : undefined)}
      minHeight={150}
      autoHeight
    />
    {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}
  </div>
);

export default RichText;
