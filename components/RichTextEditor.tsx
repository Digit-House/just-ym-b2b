import React, { useMemo } from "react";
import JoditEditor from "jodit-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  ({
    value,
    onChange,
    placeholder = "Enter content...",
    minHeight = 200,
    maxHeight = 300,
    className = "",
  }) => {
    const config = useMemo(
      () => ({
        readonly: false,
        placeholder,
        toolbarAdaptive: false,
        height: maxHeight,
        minHeight,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        buttons: [
          "source",
          "|",
          "bold",
          "italic",
          "underline",
          "|",
          "font",
          "fontsize",
          "brush",
          "paragraph",
          "|",
          "undo",
          "redo",
          "|",
          "fullsize",
          "selectall",
        ],
        textDirection: "ltr",
        iframe: false,
        useSplitMode: false,
      }),
      [placeholder, minHeight, maxHeight]
    );

    return (
      <div className={`border border-gray-300 rounded-md overflow-hidden ${className}`}>
        <JoditEditor
          value={value}
          config={config}
          onBlur={(newValue) => {
            if (newValue !== value) {
              onChange(newValue);
            }
          }}
        />
      </div>
    );
  }
);

export default RichTextEditor;
