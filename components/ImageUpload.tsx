import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

type ImageUploadProps = {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  errMsg?: string;
};

export function ImageUpload({ value, onChange, label, errMsg }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert file to Base64 to store as string in the form
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange("");
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}
      
      <div className="relative group w-full h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors bg-secondary/20">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain p-2"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Click to upload</span>
          </div>
        )}
      </div>

      {errMsg && (
        <p className="text-xs text-red-500">{errMsg}</p>
      )}
    </div>
  );
}