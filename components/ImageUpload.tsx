import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Upload, X, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { type CropSettingType } from "@/lib/cropSettings";
import  ImageCrop  from "./ImageCrop";

interface CropSettings {
  aspect?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number; // Target width for the final output
  maxHeight?: number; // Target height for the final output
}

type ImageUploadProps = {
  value?: string;
  onChange: (value: string, file?: File) => void;
  label?: string;
  errMsg?: string;
  isRequired?: boolean;
  disabled?: boolean;
  folderType: "CREDIT_TOP_UP" | "PRODUCT_MEDIA" | "USER_PROFILE";
  maxSizeMB?: number;
  allowedTypes?: string[];
  disableRemove?: boolean;
  enableCrop?: boolean;
  cropSettings?: CropSettings;
  cropShape?: "rect" | "round";
  presetCropSetting?: CropSettingType;
  mode?: "create" | "edit";
};

export type ImageUploadRef = {
  getFileToUpload: () => File | null;
};

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  (
    {
      value,
      onChange,
      label,
      disableRemove = false,
      isRequired,
      disabled = false,
      errMsg,
      maxSizeMB = 5,
      allowedTypes = ["image/jpeg", "image/jpg", "image/png"],
      enableCrop = false,
      cropSettings,
      cropShape = "rect",
      presetCropSetting,
      mode = "create",
    },
    ref
  ) => {
    const [preview, setPreview] = useState<string | undefined>(value);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    React.useEffect(() => {
      // Only update preview from value prop if it's different from current preview
      if (value && value !== preview) {
        setPreview(value);
      }
    }, [value, preview]);

    const isValidImageType = (file: File): boolean =>
      allowedTypes.includes(file.type);
    const isValidFileSize = (file: File): boolean =>
      file.size <= maxSizeMB * 1024 * 1024;

    const getTypeDisplayName = (mimeType: string): string => {
      const typeMap: Record<string, string> = {
        "image/jpeg": "JPEG",
        "image/jpg": "JPG",
        "image/png": "PNG",
      };
      return typeMap[mimeType] || mimeType;
    };

    const dataURLtoFile = (dataurl: string, filename: string): File => {
      if (!dataurl || !dataurl.startsWith("data:"))
        throw new Error("Invalid data URL format");
      const arr = dataurl.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      // if (disabled) return;
      const file = e.target.files?.[0];
      if (file) {
        if (!isValidImageType(file)) {
          toast.error(
            `Invalid file type. Please upload only ${allowedTypes
              .map((t) => getTypeDisplayName(t))
              .join(", ")}.`
          );
          return;
        }
        if (!isValidFileSize(file)) {
          toast.error(`File size exceeds ${maxSizeMB}MB limit.`);
          return;
        }

        if (enableCrop) {
          setOriginalFile(file);
          const reader = new FileReader();
          reader.onload = () => {
            const imageDataUrl = reader.result as string;
            if (imageDataUrl && imageDataUrl.startsWith("data:image")) {
              setImageSrc(imageDataUrl);
              setCropDialogOpen(true);
            } else {
              toast.error("Invalid image format.");
            }
          };
          reader.readAsDataURL(file);
        } else {
          setFileToUpload(file);
          const previewUrl = URL.createObjectURL(file);
          setPreview(previewUrl);
          // Only call onChange when in create mode
          if (mode === "create") {
            onChange(previewUrl, file);
          }
        }
      }
    };

    // Handle crop completion from ImageCrop component
    const handleCropComplete = (croppedFile: File,croppedImageUrl: string) => {
      if (!isValidFileSize(croppedFile)) {
        toast.error(`Cropped image exceeds ${maxSizeMB}MB limit.`);
        return;
      }

      setFileToUpload(croppedFile);
      setOriginalFile(null);
      console.log(croppedImageUrl);
      // Ensure the preview is updated with the cropped image
      setPreview(croppedImageUrl);
      // Only call onChange when in create mode
      if (mode === "create") {
        onChange(croppedImageUrl, croppedFile);
      }

      setCropDialogOpen(false);
      setImageSrc(null);
      toast.success("Image cropped and updated successfully!");
    };

    const handleCropCancel = () => {
      setCropDialogOpen(false);
      setImageSrc(null);
      if (originalFile) {
        const previewUrl = URL.createObjectURL(originalFile);
        setPreview(previewUrl);
        setFileToUpload(originalFile);
        // Only call onChange when in create mode
        if (mode === "create") {
          onChange(previewUrl, originalFile);
        }
        setOriginalFile(null);
      }
    };

    const handleRemove = () => {
      setPreview(undefined);
      setFileToUpload(null);
      setOriginalFile(null);
      // Only call onChange when in create mode
      if (mode === "create") {
        onChange("");
      }
    };

    const getFileToUpload = () => fileToUpload;

    useImperativeHandle(ref, () => ({ getFileToUpload }));

    return (
      <div className="space-y-1">
        {label && (
          <label className="flex items-center gap-1 text-sm font-medium">
            {label}
            {isRequired && !disabled && <span className="text-red-500">*</span>}
            {disabled && <LockKeyhole size={12} className="mb-[1px]" />}
          </label>
        )}

        <div className="relative group w-full min-h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors bg-secondary/20">
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
              {allowedTypes.map((type) => getTypeDisplayName(type)).join("/")} •{" "}
              {maxSizeMB}MB
              {enableCrop && <span className="ml-1">• Crop</span>}
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
                // className="w-full h-full object-contain p-2"
                //  className="max-h-[200px] mx-auto"
                 className="max-h-[200px] mx-auto border rounded"
                onError={(e) => {
                  // Fallback if the image fails to load
                  console.warn("Preview image failed to load:", preview);
                }}
              />
              {!disableRemove && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <Upload className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Click to upload</span>
              <span className="text-[10px] text-gray-400 mt-1">
                {allowedTypes
                  .map((type) => getTypeDisplayName(type))
                  .join(", ")}{" "}
                up to {maxSizeMB}MB
              </span>
            </div>
          )}
        </div>

        {/* Image Crop Dialog */}
        {enableCrop && (
          <ImageCrop
            isOpen={cropDialogOpen}
            onClose={handleCropCancel}
            imageSrc={imageSrc || ''}
            onCropComplete={handleCropComplete}
            // presetCropSetting={presetCropSetting}
            // cropSettings={cropSettings}
            // cropShape={cropShape}
            fileName={originalFile?.name || 'cropped_image.jpg'}
            // outputWidth={cropSettings?.maxWidth}
            // outputHeight={cropSettings?.maxHeight}
          />
        )}

        {errMsg && <p className="text-xs text-red-500">{errMsg}</p>}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
