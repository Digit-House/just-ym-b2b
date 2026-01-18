import { useState, forwardRef, useImperativeHandle } from "react";
import { Upload, X, LockKeyhole, AlertCircle } from "lucide-react";
import { toast } from "sonner";


type ImageUploadProps = {
  value?: string;
  onChange: (value: string, file?: File) => void;
  label?: string;
  errMsg?: string;
  isRequired?: boolean;
  disabled?:boolean;
  folderType: "CREDIT_TOP_UP" | "PRODUCT_MEDIA" | "USER_PROFILE";
  maxSizeMB?: number;
  allowedTypes?: string[];
};

export type ImageUploadRef = {
  getFileToUpload: () => File | null;
};

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ value, onChange, label, folderType, isRequired, disabled=false, errMsg, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'] }, ref) => {
    const [preview, setPreview] = useState<string | undefined>(value);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    const isValidImageType = (file: File): boolean => {
      return allowedTypes.includes(file.type);
    };

    const isValidFileSize = (file: File): boolean => {
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      return file.size <= maxSizeBytes;
    };

    const getFileSizeString = (bytes: number): string => {
      if (bytes < 1024) return bytes + ' bytes';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const getTypeDisplayName = (mimeType: string): string => {
      const typeMap: Record<string, string> = {
        'image/jpeg': 'JPEG',
        'image/jpg': 'JPG',
        'image/png': 'PNG'
      };
      return typeMap[mimeType] || mimeType;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const file = e.target.files?.[0];
      if (file) {
        // Validate file type
        if (!isValidImageType(file)) {
          const allowedExtensions = allowedTypes.map(type => getTypeDisplayName(type)).join(', ');
          toast.error(`Invalid file type. Please upload only ${allowedExtensions} images.`);
          return;
        }

        // Validate file size
        if (!isValidFileSize(file)) {
          toast.error(`File size exceeds ${maxSizeMB}MB limit. Current file is ${getFileSizeString(file.size)}.`);
          return;
        }

        // Store the file locally instead of immediately uploading
        setFileToUpload(file);
        // Create a preview URL for the selected file
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        // Pass the preview URL and file object to the parent component
        onChange(previewUrl, file);
        
        // Show success toast
        toast.success(`File uploaded successfully: ${file.name}`);
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
      getFileToUpload,
    }));

    return (
      <div className="space-y-1">
        {label && (
          <label
            className="flex items-center gap-1 text-sm font-medium"
          >
            {label}
            {isRequired && !disabled && <span className="text-red-500">*</span>}
            {disabled && <LockKeyhole size={12} className="mb-[1px]" />}
          </label>
        )}

        <div className="relative group w-full h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors bg-secondary/20">
          {/* Validation Info */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
              {allowedTypes.map(type => getTypeDisplayName(type)).join('/')} • {maxSizeMB}MB
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            disabled={disabled}
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
              <span className="text-[10px] text-gray-400 mt-1">
                {allowedTypes.map(type => getTypeDisplayName(type)).join(', ')} up to {maxSizeMB}MB
              </span>
            </div>
          )}
        </div>

        {errMsg && <p className="text-xs text-red-500">{errMsg}</p>}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
