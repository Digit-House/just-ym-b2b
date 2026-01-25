import React, { useEffect } from "react";
import RichTextEditor from "@/components/RichTextEditor";

interface TermsAndConditionsEditorProps {
  englishValue: string;
  myanmarValue: string;
  onEnglishChange: (value: string) => void;
  onMyanmarChange: (value: string) => void;
  englishError?: string;
  myanmarError?: string;
}

const TermsAndConditionsEditor: React.FC<TermsAndConditionsEditorProps> = ({
  englishValue,
  myanmarValue,
  onEnglishChange,
  onMyanmarChange,
  englishError,
  myanmarError,
}) => {
  // Ensure initial values are properly set
  useEffect(() => {
    if (englishValue === undefined || englishValue === null) {
      onEnglishChange("");
    }
    if (myanmarValue === undefined || myanmarValue === null) {
      onMyanmarChange("");
    }
  }, []);

  return (
    <div className="space-y-6">
      <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-gray-600"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        Terms & Conditions
      </h4>
      
      <div className="grid grid-cols-1  gap-6">
        {/* English Version */}
        <div className={`space-y-3 ${englishError ? "border border-red-300 rounded-lg p-4 bg-red-50" : ""}`}>
          <label className="block text-sm font-medium">
            Terms & Conditions (English) <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={englishValue || ""}
            onChange={onEnglishChange}
            placeholder="Enter terms and conditions in English..."
            minHeight={200}
            maxHeight={300}
          />
          {englishError && <p className="text-red-500 text-sm">{englishError}</p>}
        </div>

        {/* Myanmar Version */}
        <div className={`space-y-3 ${myanmarError ? "border border-red-300 rounded-lg p-4 bg-red-50" : ""}`}>
          <label className="block text-sm font-medium">
            Terms & Conditions (Myanmar) <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={myanmarValue || ""}
            onChange={onMyanmarChange}
            placeholder="Enter terms and conditions in Myanmar..."
            minHeight={200}
            maxHeight={300}
          />
          {myanmarError && <p className="text-red-500 text-sm">{myanmarError}</p>}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsEditor;