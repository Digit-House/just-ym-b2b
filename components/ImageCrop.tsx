import React, { useRef, useState} from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { CROP_SETTINGS, CropSettingType } from "@/lib/cropSettings";

interface CropSettings {
  aspect?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface ImageCropProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (file: File, previewUrl: string) => void;
  fileName: string;
  cropSettings?: CropSettings;
  presetCropSetting?: CropSettingType;
}

const ImageCrop: React.FC<ImageCropProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  fileName,
  cropSettings,
  presetCropSetting,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Process crop settings
  const resolvedCropSettings = presetCropSetting 
    ? CROP_SETTINGS[presetCropSetting]
    : cropSettings;
  
  // Helper to safely extract crop properties
  const getCropProps = () => {
    const props: any = {};
    if (resolvedCropSettings && 'aspect' in resolvedCropSettings && resolvedCropSettings.aspect !== undefined) {
      props.aspect = resolvedCropSettings.aspect;
    }
    if (resolvedCropSettings?.minWidth !== undefined) {
      props.minWidth = resolvedCropSettings.minWidth;
    }
    if (resolvedCropSettings?.minHeight !== undefined) {
      props.minHeight = resolvedCropSettings.minHeight;
    }
    return props;
  };

  // ✅ YOUR REQUESTED DEFAULT CROP
  const [crop, setCrop] = useState<Crop>(() => {
    const baseCrop = {
      unit: "%" as const,
      x: 25,
      y: 25,
      width: 50,
      height: 50,
    };

    // Check if the resolved settings has an aspect property
    if (resolvedCropSettings && 'aspect' in resolvedCropSettings && resolvedCropSettings.aspect !== undefined) {
      const aspect = resolvedCropSettings.aspect;
      // Calculate height based on aspect ratio if width is set
      const calculatedHeight = (baseCrop.width * 100) / aspect;
      return {
        ...baseCrop,
        aspect,
        height: Math.min(calculatedHeight, 50), // Ensure it doesn't exceed our default
      };
    }
    
    return baseCrop;
  });

  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  if (!isOpen) return null;

  const onImageLoaded = (img: HTMLImageElement) => {
    imgRef.current = img;
  };

  const applyCrop = async () => {
    if (!imgRef.current || !completedCrop) return;

    const file = await getCroppedFile(
      imgRef.current,
      completedCrop,
      fileName,
      resolvedCropSettings
    );

    const previewUrl = URL.createObjectURL(file);

    // ✅ ORDER MATTERS (File FIRST)
    onCropComplete(file, previewUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-md p-4 w-[90vw] max-w-[500px]">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          {...getCropProps()}
        >
          <img
            src={imageSrc}
            onLoad={(e) => onImageLoaded(e.currentTarget)}
            alt="Crop"
            className="max-h-[60vh] mx-auto"
          />
        </ReactCrop>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-3 py-1 border rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-3 py-1 ${completedCrop ? "bg-indigo-600" : "bg-gray-300"} text-white rounded`}
            onClick={applyCrop}
            disabled={!completedCrop}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCrop;

/* ---------------------------------- */
/* --------- helpers ----------------- */
/* ---------------------------------- */

async function getCroppedFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
  cropSettings?: CropSettings
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Use target dimensions if specified in crop settings, otherwise use crop dimensions
  const targetWidth = cropSettings?.maxWidth || crop.width;
  const targetHeight = cropSettings?.maxHeight || crop.height;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas error");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Crop failed");
      resolve(new File([blob], fileName, { type: "image/jpeg" }));
    }, "image/jpeg");
  });
}
