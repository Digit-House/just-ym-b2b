import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scissors, X } from "lucide-react";
import { toast } from "sonner";
import { CROP_SETTINGS, type CropSettingType } from "@/lib/cropSettings";

interface CropSettings {
  aspect?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface ImageCropProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string, croppedFile: File) => void;
  presetCropSetting?: CropSettingType;
  cropSettings?: CropSettings;
  cropShape?: 'rect' | 'round';
  fileName?: string;
  outputWidth?: number;
  outputHeight?: number;
}

export const ImageCrop = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  presetCropSetting,
  cropSettings,
  cropShape = 'rect',
  fileName = 'cropped_image.jpg',
  outputWidth,
  outputHeight
}: ImageCropProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [selectedPreset, setSelectedPreset] = useState<CropSettingType | 'custom'>(
    presetCropSetting || 'custom'
  );
  const imgRef = useRef<HTMLImageElement>(null);

  // Merge crop settings
  const currentCropSettings = selectedPreset === 'custom' 
    ? cropSettings 
    : CROP_SETTINGS[selectedPreset];
  
  const typedCropSettings = currentCropSettings as CropSettings | undefined;

  // Function to convert data URL to File object
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    if (!dataurl || !dataurl.startsWith('data:')) {
      throw new Error('Invalid data URL format');
    }
    
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    // Force JPEG format to ensure consistency with the canvas output
    const mime = 'image/jpeg';
    const bstr = atob(arr[1]); 
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  };

  // Function to get cropped image
  const getCroppedImg = (
    image: HTMLImageElement, 
    pixelCrop: PixelCrop, 
    targetWidth?: number, 
    targetHeight?: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!image.complete) {
        reject(new Error('Image is not loaded completely'));
        return;
      }
        
      // Validate crop dimensions before creating canvas
      if (pixelCrop.width <= 0 || pixelCrop.height <= 0) {
        reject(new Error('Invalid crop dimensions: width and height must be greater than 0'));
        return;
      }
        
      // Create canvas with natural dimensions to maintain quality
      const canvas = document.createElement('canvas');
        
      // Use actual pixel dimensions for the crop to maintain precision
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
        
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No 2d context'));
        return;
      }
        
      // Improve rendering quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
        
      try {
        // Clear canvas and set white background to handle transparency
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Validate source image coordinates to avoid drawing errors
        const sx = Math.max(0, Math.min(image.naturalWidth, pixelCrop.x));
        const sy = Math.max(0, Math.min(image.naturalHeight, pixelCrop.y));
        const sw = Math.max(0, Math.min(image.naturalWidth - sx, pixelCrop.width));
        const sh = Math.max(0, Math.min(image.naturalHeight - sy, pixelCrop.height));
        
        // Only draw if all dimensions are valid
        if (sw > 0 && sh > 0 && canvas.width > 0 && canvas.height > 0) {
          // Draw the cropped image area
          ctx.drawImage(
            image,
            sx,
            sy,
            sw,
            sh,
            0,
            0,
            canvas.width,
            canvas.height,
          );
        } else {
          reject(new Error('Invalid drawing dimensions'));
          return;
        }
              
        let finalCanvas = canvas;
      
        // 2. If specific target dimensions are provided, resize the canvas
        if (targetWidth && targetHeight) {
          // Only resize if dimensions are actually different
          if (Math.round(canvas.width) !== Math.round(targetWidth) || Math.round(canvas.height) !== Math.round(targetHeight)) {
            // Validate target dimensions
            if (targetWidth <= 0 || targetHeight <= 0) {
              reject(new Error('Invalid target dimensions: width and height must be greater than 0'));
              return;
            }
            
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = targetWidth;
            resizedCanvas.height = targetHeight;
            const rCtx = resizedCanvas.getContext('2d');
                    
            if (rCtx) {
              // Fill with white background to handle transparency
              rCtx.fillStyle = 'white';
              rCtx.fillRect(0, 0, resizedCanvas.width, resizedCanvas.height);
              
              rCtx.imageSmoothingEnabled = true;
              rCtx.imageSmoothingQuality = 'high';
              // Draw with the target dimensions, with validation
              if (canvas.width > 0 && canvas.height > 0 && targetWidth > 0 && targetHeight > 0) {
                rCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
                finalCanvas = resizedCanvas;
              }
            }
          }
        }
          
        // Export final canvas to Data URL
        try {
          // Ensure output is JPEG format to avoid transparency issues
          const dataUrl = finalCanvas.toDataURL('image/jpeg', 0.92);
          if (dataUrl && dataUrl !== 'data:,') {
            resolve(dataUrl);
            return;
          }
        } catch (e) {
          console.warn('Failed to create data URL, falling back to toBlob:', e);
        }
          
        // Attempt to export as blob with fallback
        try {
          finalCanvas.toBlob(blob => {
            if (blob) {
              const reader = new FileReader(); 
              reader.onload = () => {
                const result = reader.result as string;
                if (result && result !== 'data:,') {
                  resolve(result);
                } else {
                  reject(new Error('Generated data URL is empty'));
                }
              };
              reader.onerror = () => reject(new Error('Failed to read cropped image')); 
              reader.readAsDataURL(blob);
            } else {
              // Fallback: try toDataURL as last resort
              try {
                const fallbackDataUrl = finalCanvas.toDataURL('image/jpeg', 0.92);
                if (fallbackDataUrl && fallbackDataUrl !== 'data:,') {
                  resolve(fallbackDataUrl);
                } else {
                  reject(new Error('Canvas toBlob and toDataURL both failed'));
                }
              } catch (fallbackError) {
                reject(new Error('Canvas toBlob failed and fallback toDataURL also failed'));
              }
            }
          }, 'image/jpeg', 0.92);
        } catch (toBlobError) {
          console.warn('toBlob failed, trying fallback:', toBlobError);
          // Fallback: try toDataURL as last resort
          try {
            const fallbackDataUrl = finalCanvas.toDataURL('image/jpeg', 0.92);
            if (fallbackDataUrl && fallbackDataUrl !== 'data:,') {
              resolve(fallbackDataUrl);
            } else {
              reject(new Error('Canvas toBlob failed and fallback toDataURL also failed'));
            }
          } catch (fallbackError) {
            reject(new Error('Canvas toBlob failed and fallback toDataURL also failed'));
          }
        }
          
      } catch (error) {
        console.error('Error during canvas operations:', error);
        reject(error);
      }
    });
  };

  // Handle crop completion
  const handleCropComplete = async () => {
    if (imgRef.current && completedCrop) {
      // Make sure the image is completely loaded before cropping
      if (!imgRef.current.complete) {
        toast.error('Image is still loading, please wait.');
        return;
      }
      
      try {
        const croppedImageUrl = await getCroppedImg(
          imgRef.current, 
          completedCrop,
          typedCropSettings?.maxWidth || outputWidth,
          typedCropSettings?.maxHeight || outputHeight
        );
        
        if (!croppedImageUrl || croppedImageUrl === 'data:,') {
          throw new Error('Failed to generate cropped image');
        }
        
        const croppedFile = dataURLtoFile(croppedImageUrl, fileName);
        
        onCropComplete(croppedImageUrl, croppedFile);
        toast.success('Image cropped successfully!');
      } catch (error) {
        console.error('Error cropping image:', error);
        toast.error(`Error cropping image: ${(error as Error).message}`);
      }
    }
  };

  // Handle image load
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    
    // Wait for the image to be fully loaded and rendered
    const setInitialCrop = () => {
      // Use the natural width/height to ensure consistency
      const { naturalWidth, naturalHeight } = img;
      
      // Force a reflow to ensure the image is rendered
      img.offsetHeight;
      
      if (typedCropSettings?.aspect) {
        const crop = makeAspectCrop(
          { unit: '%', width: 90 }, 
          typedCropSettings.aspect, 
          naturalWidth, 
          naturalHeight
        );
        const centeredCrop = centerCrop(crop, naturalWidth, naturalHeight);
        setCrop(centeredCrop);
        
        // Calculate actual displayed dimensions accounting for object-contain
        setTimeout(() => { // Use timeout to ensure DOM has updated
          const displayWidth = imgRef.current?.clientWidth || naturalWidth;
          const displayHeight = imgRef.current?.clientHeight || naturalHeight;
          
          const aspectRatio = naturalWidth / naturalHeight;
          const elementAspectRatio = displayWidth / displayHeight;
          
          let renderedWidth, renderedHeight, offsetX = 0, offsetY = 0;
          if (elementAspectRatio > aspectRatio) {
            // Height is the limiting dimension
            renderedHeight = displayHeight;
            renderedWidth = displayHeight * aspectRatio;
            offsetX = (displayWidth - renderedWidth) / 2;
          } else {
            // Width is the limiting dimension
            renderedWidth = displayWidth;
            renderedHeight = displayWidth / aspectRatio;
            offsetY = (displayHeight - renderedHeight) / 2;
          }
          
          // Calculate scale factors from rendered image to natural image
          const scaleX = naturalWidth / renderedWidth;
          const scaleY = naturalHeight / renderedHeight;
          
          // Convert crop coordinates from percentage of displayed image to pixels of natural image
          // Use the crop position relative to the actual rendered image (considering offset)
          const cropXPercent = (centeredCrop.x * displayWidth / 100 - offsetX) / renderedWidth;
          const cropYPercent = (centeredCrop.y * displayHeight / 100 - offsetY) / renderedHeight;
          
          // Ensure we don't go out of bounds
          let x = Math.max(0, Math.min(naturalWidth, cropXPercent * naturalWidth));
          let y = Math.max(0, Math.min(naturalHeight, cropYPercent * naturalHeight));
          let width = Math.min(naturalWidth - x, (centeredCrop.width * renderedWidth / 100) * scaleX);
          let height = Math.min(naturalHeight - y, (centeredCrop.height * renderedHeight / 100) * scaleY);
          
          // Ensure minimum dimensions to prevent zero-size crops
          width = Math.max(1, width);
          height = Math.max(1, height);
          
          // Ensure the crop stays within bounds
          if (x + width > naturalWidth) {
            x = Math.max(0, naturalWidth - width);
          }
          if (y + height > naturalHeight) {
            y = Math.max(0, naturalHeight - height);
          }
          
          setCompletedCrop({
            x,
            y,
            width,
            height,
            unit: 'px' as const,
          });
        }, 0);
      } else {
        const cropWidthInPixels = Math.min(naturalWidth * 0.8, typedCropSettings?.maxWidth || naturalWidth * 0.8);
        const cropHeightInPixels = Math.min(naturalHeight * 0.8, typedCropSettings?.maxHeight || naturalHeight * 0.8);
        const crop: Crop = {
          unit: '%',
          x: (naturalWidth - cropWidthInPixels) / 2 / naturalWidth * 100,
          y: (naturalHeight - cropHeightInPixels) / 2 / naturalHeight * 100,
          width: cropWidthInPixels / naturalWidth * 100,
          height: cropHeightInPixels / naturalHeight * 100,
        };
        setCrop(crop);
        
        // Calculate actual displayed dimensions accounting for object-contain
        setTimeout(() => { // Use timeout to ensure DOM has updated
          const displayWidth = imgRef.current?.clientWidth || naturalWidth;
          const displayHeight = imgRef.current?.clientHeight || naturalHeight;
          
          const aspectRatio = naturalWidth / naturalHeight;
          const elementAspectRatio = displayWidth / displayHeight;
          
          let renderedWidth, renderedHeight, offsetX = 0, offsetY = 0;
          if (elementAspectRatio > aspectRatio) {
            // Height is the limiting dimension
            renderedHeight = displayHeight;
            renderedWidth = displayHeight * aspectRatio;
            offsetX = (displayWidth - renderedWidth) / 2;
          } else {
            // Width is the limiting dimension
            renderedWidth = displayWidth;
            renderedHeight = displayWidth / aspectRatio;
            offsetY = (displayHeight - renderedHeight) / 2;
          }
          
          // Calculate scale factors from rendered image to natural image
          const scaleX = naturalWidth / renderedWidth;
          const scaleY = naturalHeight / renderedHeight;
          
          // Convert crop coordinates from percentage of displayed image to pixels of natural image
          // Use the crop position relative to the actual rendered image (considering offset)
          const cropXPercent = (crop.x * displayWidth / 100 - offsetX) / renderedWidth;
          const cropYPercent = (crop.y * displayHeight / 100 - offsetY) / renderedHeight;
          
          // Ensure we don't go out of bounds
          let x = Math.max(0, Math.min(naturalWidth, cropXPercent * naturalWidth));
          let y = Math.max(0, Math.min(naturalHeight, cropYPercent * naturalHeight));
          let width = Math.min(naturalWidth - x, (crop.width * renderedWidth / 100) * scaleX);
          let height = Math.min(naturalHeight - y, (crop.height * renderedHeight / 100) * scaleY);
          
          // Ensure minimum dimensions to prevent zero-size crops
          width = Math.max(1, width);
          height = Math.max(1, height);
          
          // Ensure the crop stays within bounds
          if (x + width > naturalWidth) {
            x = Math.max(0, naturalWidth - width);
          }
          if (y + height > naturalHeight) {
            y = Math.max(0, naturalHeight - height);
          }
          
          setCompletedCrop({
            x,
            y,
            width,
            height,
            unit: 'px' as const,
          });
        }, 0);
      }
    };

    if (!img.complete) {
      img.onload = () => setInitialCrop();
    } else {
      setInitialCrop();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full overflow-auto z-10">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Crop Image</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4 p-5">
          {/* Crop preset selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Preset</label>
            <Select 
              value={selectedPreset} 
              onValueChange={(value) => setSelectedPreset(value as CropSettingType | 'custom')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a crop preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="TICKET_CARD">Ticket Card (418×208)</SelectItem>
                <SelectItem value="CATEGORY_IMAGE">Category Image (252×208)</SelectItem>
                <SelectItem value="LANDING_HERO">Landing Hero (1440×700)</SelectItem>
                <SelectItem value="EXPLORE_PAGE">Explore Page (1440×420)</SelectItem>
                <SelectItem value="GET_INSPIRED_BIG">Get Inspired Big (535×528)</SelectItem>
                <SelectItem value="GET_INSPIRED_SMALL">Get Inspired Small (372×256)</SelectItem>
                <SelectItem value="TICKET_DETAIL_BIG">Ticket Detail Big (1095×417)</SelectItem>
                <SelectItem value="TICKET_DETAIL_SMALL">Ticket Detail Small (200×128)</SelectItem>
                <SelectItem value="PAYMENT_LOGO_SQUARE">Payment Logo Square</SelectItem>
                <SelectItem value="PAYMENT_LOGO_LANDSCAPE">Payment Logo Landscape</SelectItem>
                <SelectItem value="DOCUMENT_UPLOAD">Document Upload</SelectItem>
                <SelectItem value="PROFILE_IMAGE">Profile Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Crop area */}
          <div className="relative max-h-[60vh] overflow-auto flex justify-center items-center bg-white rounded-lg p-4 min-h-[300px]">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => {
                  setCrop(c);
                  // Update completed crop as the user drags the crop area
                  if (imgRef.current && imgRef.current.complete) {
                    // Calculate actual rendered dimensions accounting for object-contain
                    const displayWidth = imgRef.current.clientWidth;
                    const displayHeight = imgRef.current.clientHeight;
                    
                    const aspectRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
                    const elementAspectRatio = displayWidth / displayHeight;
                    
                    let renderedWidth, renderedHeight, offsetX = 0, offsetY = 0;
                    if (elementAspectRatio > aspectRatio) {
                      // Height is the limiting dimension
                      renderedHeight = displayHeight;
                      renderedWidth = displayHeight * aspectRatio;
                      offsetX = (displayWidth - renderedWidth) / 2;
                    } else {
                      // Width is the limiting dimension
                      renderedWidth = displayWidth;
                      renderedHeight = displayWidth / aspectRatio;
                      offsetY = (displayHeight - renderedHeight) / 2;
                    }
                    
                    // Calculate scale factors from rendered image to natural image
                    const scaleX = imgRef.current.naturalWidth / renderedWidth;
                    const scaleY = imgRef.current.naturalHeight / renderedHeight;
                    
                    // Convert crop coordinates from percentage of displayed image to pixels of natural image
                    // Use the crop position relative to the actual rendered image (considering offset)
                    const cropXPercent = (c.x * displayWidth / 100 - offsetX) / renderedWidth;
                    const cropYPercent = (c.y * displayHeight / 100 - offsetY) / renderedHeight;
                    
                    // Ensure we don't go out of bounds
                    let x = Math.max(0, Math.min(imgRef.current.naturalWidth, cropXPercent * imgRef.current.naturalWidth));
                    let y = Math.max(0, Math.min(imgRef.current.naturalHeight, cropYPercent * imgRef.current.naturalHeight));
                    let width = Math.min(imgRef.current.naturalWidth - x, (c.width * renderedWidth / 100) * scaleX);
                    let height = Math.min(imgRef.current.naturalHeight - y, (c.height * renderedHeight / 100) * scaleY);
                    
                    // Ensure minimum dimensions to prevent zero-size crops
                    width = Math.max(1, width);
                    height = Math.max(1, height);
                    
                    // Ensure the crop stays within bounds
                    if (x + width > imgRef.current.naturalWidth) {
                      x = Math.max(0, imgRef.current.naturalWidth - width);
                    }
                    if (y + height > imgRef.current.naturalHeight) {
                      y = Math.max(0, imgRef.current.naturalHeight - height);
                    }
                    
                    setCompletedCrop({
                      x,
                      y,
                      width,
                      height,
                      unit: 'px' as const
                    });
                  }
                }}
                onComplete={(c) => {
                  // Ensure completed crop is set when user finishes dragging
                  if (imgRef.current && imgRef.current.complete) {
                    // Calculate actual rendered dimensions accounting for object-contain
                    const displayWidth = imgRef.current.clientWidth;
                    const displayHeight = imgRef.current.clientHeight;
                    
                    const aspectRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
                    const elementAspectRatio = displayWidth / displayHeight;
                    
                    let renderedWidth, renderedHeight, offsetX = 0, offsetY = 0;
                    if (elementAspectRatio > aspectRatio) {
                      // Height is the limiting dimension
                      renderedHeight = displayHeight;
                      renderedWidth = displayHeight * aspectRatio;
                      offsetX = (displayWidth - renderedWidth) / 2;
                    } else {
                      // Width is the limiting dimension
                      renderedWidth = displayWidth;
                      renderedHeight = displayWidth / aspectRatio;
                      offsetY = (displayHeight - renderedHeight) / 2;
                    }
                    
                    // Calculate scale factors from rendered image to natural image
                    const scaleX = imgRef.current.naturalWidth / renderedWidth;
                    const scaleY = imgRef.current.naturalHeight / renderedHeight;
                    
                    // Convert crop coordinates from percentage of displayed image to pixels of natural image
                    // Use the crop position relative to the actual rendered image (considering offset)
                    const cropXPercent = (c.x * displayWidth / 100 - offsetX) / renderedWidth;
                    const cropYPercent = (c.y * displayHeight / 100 - offsetY) / renderedHeight;
                    
                    // Ensure we don't go out of bounds
                    let x = Math.max(0, Math.min(imgRef.current.naturalWidth, cropXPercent * imgRef.current.naturalWidth));
                    let y = Math.max(0, Math.min(imgRef.current.naturalHeight, cropYPercent * imgRef.current.naturalHeight));
                    let width = Math.min(imgRef.current.naturalWidth - x, (c.width * renderedWidth / 100) * scaleX);
                    let height = Math.min(imgRef.current.naturalHeight - y, (c.height * renderedHeight / 100) * scaleY);
                    
                    // Ensure minimum dimensions to prevent zero-size crops
                    width = Math.max(1, width);
                    height = Math.max(1, height);
                    
                    // Ensure the crop stays within bounds
                    if (x + width > imgRef.current.naturalWidth) {
                      x = Math.max(0, imgRef.current.naturalWidth - width);
                    }
                    if (y + height > imgRef.current.naturalHeight) {
                      y = Math.max(0, imgRef.current.naturalHeight - height);
                    }
                    
                    setCompletedCrop({
                      x,
                      y,
                      width,
                      height,
                      unit: 'px' as const
                    });
                  }
                }}
                aspect={typedCropSettings?.aspect}
                minWidth={typedCropSettings?.minWidth}
                minHeight={typedCropSettings?.minHeight}
                maxWidth={typedCropSettings?.maxWidth}
                maxHeight={typedCropSettings?.maxHeight}
                circularCrop={cropShape === 'round'}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  crossOrigin="anonymous"
                  className="max-h-[50vh] object-contain"
                  style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '50vh' }}
                />
              </ReactCrop>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleCropComplete}
              disabled={!completedCrop}
            >
              <Scissors className="w-4 h-4 mr-2" />
              Apply Crop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCrop;