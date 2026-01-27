import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Upload, X, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { preFixImg } from "@/util/initData";
import ImageFallback from "./ImageFallback";
import ImageCrop from "./ImageCrop";
import { CropSettingType } from "@/lib/cropSettings";

/* -------------------- TYPES -------------------- */

interface CropSettings {
  aspect?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
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
      presetCropSetting,
      mode = "create",
    },
    ref
  ) => {
    const [preview, setPreview] = useState<string | undefined>(value);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalValue, setOriginalValue] = useState<string | undefined>(
      value
    );
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    /* 🔥 PREVIEW DIALOG STATE */
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (value && value !== preview) {
        setPreview(value);
      }
      setOriginalValue(value);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!isValidImageType(file)) {
        toast.error(
          `Invalid file type. Please upload only ${allowedTypes
            .map(getTypeDisplayName)
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
        setOriginalValue(preview);

        const reader = new FileReader();
        reader.onload = () => {
          const imageDataUrl = reader.result as string;
          setImageSrc(imageDataUrl);
          setCropDialogOpen(true);
        };
        reader.readAsDataURL(file);
      } else {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setFileToUpload(file);

        if (mode === "create") {
          onChange(previewUrl, file);
        }
      }
    };

    const handleCropComplete = (croppedFile: File, croppedImageUrl: string) => {
      if (!isValidFileSize(croppedFile)) {
        toast.error(`Cropped image exceeds ${maxSizeMB}MB limit.`);
        return;
      }

      setFileToUpload(croppedFile);
      setPreview(croppedImageUrl);
      setOriginalValue(croppedImageUrl);
      setCropDialogOpen(false);
      setImageSrc(null);

      if (mode === "create") {
        onChange(croppedImageUrl, croppedFile);
      }

      toast.success("Image cropped successfully!");
    };

    const handleCropCancel = () => {
      setCropDialogOpen(false);
      setImageSrc(null);
      setOriginalFile(null);
      setFileToUpload(null);
      setPreview(originalValue);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleRemove = () => {
      setPreview(undefined);
      setFileToUpload(null);
      setOriginalFile(null);
      setOriginalValue(undefined);

      if (mode === "create") {
        onChange("");
      }
    };

    /* 🔥 PREVIEW DIALOG HANDLERS */
    const handlePreviewOpen = () => {
      if (!preview) return;
      setPreviewDialogOpen(true);
    };

    const handlePreviewClose = () => {
      setPreviewDialogOpen(false);
    };

    const getFileToUpload = () => fileToUpload;
    useImperativeHandle(ref, () => ({ getFileToUpload }));

    return (
      <div className="space-y-1">
        {label && (
          <label className="flex items-center gap-1 text-sm font-medium">
            {label}
            {isRequired && !disabled && (
              <span className="text-red-500">*</span>
            )}
            {disabled && <LockKeyhole size={12} />}
          </label>
        )}

        <div className="relative group w-full h-50 border-2 border-dashed rounded-md flex items-center justify-center bg-secondary/20 hover:bg-secondary/50 transition">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            disabled={disabled}
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          {preview ? (
            <div className="relative w-full h-full">
              {preview.includes("blob:") ? (
                <img
                  src={preview}
                  alt="Preview"
                  onClick={handlePreviewOpen}
                  className="w-full h-full object-contain p-2 cursor-zoom-in"
                />
              ) : (
                <ImageFallback
                  src={preFixImg(preview)}
                  alt="Preview"
                  onClick={handlePreviewOpen}
                  className="w-full h-full object-contain p-2 cursor-zoom-in"
                />
              )}

              {!disableRemove && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <Upload className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Click to upload</span>
            </div>
          )}
        </div>

        {/* 🔥 IMAGE PREVIEW DIALOG */}
        {previewDialogOpen && preview && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            onClick={handlePreviewClose}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] w-full px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handlePreviewClose}
                className="absolute -top-10 right-0 text-white hover:text-red-400"
              >
                <X className="w-6 h-6" />
              </button>

              {preview.includes("blob:") ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-md"
                />
              ) : (
                <ImageFallback
                  src={preFixImg(preview)}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-md"
                />
              )}
            </div>
          </div>
        )}

        {/* CROP DIALOG */}
        {enableCrop && cropDialogOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center">
            <ImageCrop
              isOpen={cropDialogOpen}
              onClose={handleCropCancel}
              imageSrc={imageSrc || ""}
              onCropComplete={handleCropComplete}
              presetCropSetting={presetCropSetting}
              cropSettings={cropSettings}
              fileName={originalFile?.name || `image_${Date.now()}.jpg`}
            />
          </div>
        )}

        {errMsg && <p className="text-xs text-red-500">{errMsg}</p>}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";
export default ImageUpload;
