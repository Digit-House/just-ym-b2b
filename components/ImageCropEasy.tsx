import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { CROP_SETTINGS, CropSettings, CropSettingType, getCroppedFile, getCropSettingsInfo } from "@/lib/cropSettings";

interface ImageCropEasyProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (file: File, previewUrl: string) => void;
  fileName: string;
  cropSettings?: CropSettings;
  presetCropSetting?: CropSettingType;
}

const ImageCropEasy: React.FC<ImageCropEasyProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  fileName,
  cropSettings,
  presetCropSetting,
}) => {
  const resolvedCropSettings = presetCropSetting
    ? CROP_SETTINGS[presetCropSetting]
    : cropSettings;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCropped, setIsCropped] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Get crop settings info
  const cropSettingsInfo = getCropSettingsInfo(resolvedCropSettings, presetCropSetting);

  if (!isOpen) return null;

  const onCropCompleteHandler = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      console.log('Crop complete:', { _croppedArea, croppedAreaPixels });
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const applyCrop = async () => {
    console.log('Apply crop clicked', { croppedAreaPixels, imgRef: !!imgRef.current });
    
    if (!croppedAreaPixels) {
      console.log('Cannot apply crop - missing croppedAreaPixels');
      console.log('croppedAreaPixels:', croppedAreaPixels);
      return;
    }
    
    // Create image element from imageSrc instead of relying on ref
    const img = new Image();
    img.src = imageSrc;
    
    // Wait for image to load if it's not already loaded
    if (!img.complete) {
      await new Promise((resolve) => {
        img.onload = resolve;
      });
    }
    
    console.log('Image ready for cropping:', img);

    const file = await getCroppedFile(
      img,
      {
        x: croppedAreaPixels.x,
        y: croppedAreaPixels.y,
        width: croppedAreaPixels.width,
        height: croppedAreaPixels.height,
        unit: "px",
      },
      fileName,
      resolvedCropSettings
    );

    const previewUrl = URL.createObjectURL(file);
    setPreviewUrl(previewUrl);
    setIsCropped(true);
    // Call the callback to notify parent component
    onCropComplete(file, previewUrl);
  };


  // Also capture image ref directly from Cropper component
  const handleMediaLoaded = (media: HTMLImageElement) => {
    console.log('Media loaded from cropper:', media);
    if (media && media.complete) {
      imgRef.current = media;
    }
  };

  const handleClose = () => {
    // Clean up preview URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setIsCropped(false);
    setPreviewUrl(null);
    setCroppedAreaPixels(null);
    onClose();
  };

  const handleReset = () => {
    setIsCropped(false);
    setPreviewUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const aspectRatio = (resolvedCropSettings as CropSettings)?.aspect || 1;

  // Show preview after cropping
  if (isCropped && previewUrl) {
    return (
      <div className="fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-4">
        <div className="bg-white rounded-md w-full max-w-2xl">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">Cropped Preview</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {cropSettingsInfo.description}
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {cropSettingsInfo.label}
              </span>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 flex justify-center">
            <img
              src={previewUrl}
              alt="Cropped preview"
              className="max-h-[60vh] max-w-full object-contain rounded-md border"
            />
          </div>

          {/* Buttons */}
          <div className="p-4 border-t flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={handleReset}
            >
              Crop Again
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-md w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">Crop Image</h3>
              <p className="text-sm text-gray-500 mt-1">
                {cropSettingsInfo.description}
              </p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {cropSettingsInfo.label}
            </span>
          </div>
        </div>

        {/* Crop Area */}
        <div className="relative flex-1 min-h-[400px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
            onMediaLoaded={handleMediaLoaded}
            showGrid={true}
            cropShape="rect"
            classes={{
              containerClassName: "rounded-none h-full",
              mediaClassName: "rounded-none",
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-4 border-t space-y-4">
          {/* Zoom Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md transition-colors ${
                croppedAreaPixels != null
                  ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={applyCrop}
              disabled={croppedAreaPixels == null}
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropEasy;