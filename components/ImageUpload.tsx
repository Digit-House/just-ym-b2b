import { useState, forwardRef, useImperativeHandle } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { getSignedUrlAndImageDataUpload } from "@/util";

type ImageUploadProps = {
  value?: string;
  onChange: (value: string, file?: File) => void;
  label?: string;
  errMsg?: string;
  isRequired?: boolean;
  folderType: "CREDIT_TOP_UP" | "PRODUCT_MEDIA" | "USER_PROFILE";
};

export type ImageUploadRef = {
  getFileToUpload: () => File | null;
};

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(({
  value,
  onChange,
  label,
  folderType,
  isRequired,
  errMsg,
}, ref) => {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file locally instead of immediately uploading
      setFileToUpload(file);
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      // Pass the preview URL and file object to the parent component
      onChange(previewUrl, file);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    setFileToUpload(null);
    onChange("");
  };

  // Method to get the file that needs to be uploaded
  const getFileToUpload = () => {
    return fileToUpload;
  };

  // Expose the method to get the file via ref
  useImperativeHandle(ref, () => ({
    getFileToUpload
  }));

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium">
          {label} {isRequired && <span className="text-red-500">*</span>}
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

      {errMsg && <p className="text-xs text-red-500">{errMsg}</p>}
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;