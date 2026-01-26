import React, { useRef, useState } from "react";
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

  const resolvedCropSettings = presetCropSetting
    ? CROP_SETTINGS[presetCropSetting]
    : cropSettings;

  const [aspect, setAspect] = useState<number | undefined>(undefined);

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  if (!isOpen) return null;


  const getCropProps = () => {
    const props: any = {};

    if (aspect !== undefined) props.aspect = aspect;
    if (resolvedCropSettings?.minWidth !== undefined)
      props.minWidth = resolvedCropSettings.minWidth;
    if (resolvedCropSettings?.minHeight !== undefined)
      props.minHeight = resolvedCropSettings.minHeight;

    return props;
  };

  const onImageLoaded = (img: HTMLImageElement) => {
    imgRef.current = img;
  };

  const handleAspectChange = (newAspect?: number) => {
    setAspect(newAspect);

    setCrop({
      unit: "%",
      x: 10,
      y: 10,
      width: 80,
      height: newAspect ? 80 / newAspect : 80,
      // aspect: newAspect ?? undefined,
    });
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
    onCropComplete(file, previewUrl);
  };

  return (
    <div className="fixed inset-0 z-100 bg-black/60 flex items-center justify-center">
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
            className={`px-3 py-1 ${
              completedCrop ? "bg-indigo-600" : "bg-gray-300"
            } text-white rounded`}
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

/* -------------------- CANVAS UTILITY -------------------- */

async function getCroppedFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
  cropSettings?: CropSettings
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Actual pixel dimensions of the crop region
  let cropWidth = crop.width * scaleX;
  let cropHeight = crop.height * scaleY;

  // Respect maxWidth/maxHeight if provided, otherwise keep full resolution
  if (cropSettings?.maxWidth && cropWidth > cropSettings.maxWidth) {
    const ratio = cropSettings.maxWidth / cropWidth;
    cropWidth = cropSettings.maxWidth;
    cropHeight = cropHeight * ratio;
  }
  if (cropSettings?.maxHeight && cropHeight > cropSettings.maxHeight) {
    const ratio = cropSettings.maxHeight / cropHeight;
    cropHeight = cropSettings.maxHeight;
    cropWidth = cropWidth * ratio;
  }

  canvas.width = cropWidth;
  canvas.height = cropHeight;

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
    cropWidth,
    cropHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) throw new Error("Crop failed");
        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      },
      "image/jpeg",
      1
    );
  });
}


// async function getCroppedFile(
//   image: HTMLImageElement,
//   crop: PixelCrop,
//   fileName: string,
//   cropSettings?: CropSettings
// ): Promise<File> {
//   const canvas = document.createElement("canvas");
//   const scaleX = image.naturalWidth / image.width;
//   const scaleY = image.naturalHeight / image.height;

//   const targetWidth = cropSettings?.maxWidth || crop.width;
//   const targetHeight = cropSettings?.maxHeight || crop.height;

//   canvas.width = targetWidth;
//   canvas.height = targetHeight;

//   const ctx = canvas.getContext("2d");
//   if (!ctx) throw new Error("Canvas error");

//   ctx.drawImage(
//     image,
//     crop.x * scaleX,
//     crop.y * scaleY,
//     crop.width * scaleX,
//     crop.height * scaleY,
//     0,
//     0,
//     targetWidth,
//     targetHeight
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob(
//       (blob) => {
//         if (!blob) throw new Error("Crop failed");
//         resolve(new File([blob], fileName, { type: "image/jpeg" }));
//       },
//       "image/jpeg",
//       1
//     );
//   });
// }




 {/* Aspect ratio buttons */}
        {/* <div className="flex gap-2 mb-3 flex-wrap">
          {ASPECT_RATIOS.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => handleAspectChange(r.value)}
              className={`px-3 py-1 rounded border text-sm
                ${
                  aspect === r.value
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white border-gray-300"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div> */}


        