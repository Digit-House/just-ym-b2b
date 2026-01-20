import React, { useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (file: File, previewUrl: string) => void;
  fileName: string;
}

const ImageCrop: React.FC<ImageCropProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  fileName,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  // ✅ YOUR REQUESTED DEFAULT CROP
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
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
      fileName
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
  fileName: string
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

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
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Crop failed");
      resolve(new File([blob], fileName, { type: "image/jpeg" }));
    }, "image/jpeg");
  });
}
