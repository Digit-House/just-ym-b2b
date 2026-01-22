import React, { useState } from "react";
import { ImageUpload } from "../components/ImageUpload";

const ImageCropTest: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Crop Test</h1>
      <p className="mb-4">This page demonstrates the new aspect ratio toggle functionality in the image cropping component.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">With Custom Crop Settings</h2>
          <ImageUpload
            value={imageUrl}
            onChange={(value, file) => {
              setImageUrl(value);
            }}
            label="Upload Image"
            folderType="USER_PROFILE"
            enableCrop={true}
            cropSettings={{
              aspect: 16/9, // 16:9 aspect ratio
              minWidth: 400,
              minHeight: 225
            }}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">With Preset Crop Setting</h2>
          <ImageUpload
            value={imageUrl}
            onChange={(value, file) => {
              setImageUrl(value);
            }}
            label="Upload Image with Preset"
            folderType="USER_PROFILE"
            enableCrop={true}
            presetCropSetting="LANDING_HERO" // Uses 1440x700 aspect ratio
          />
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Uploaded Image Preview</h2>
        {imageUrl ? (
          <div className="border rounded-lg p-4">
            <img 
              src={imageUrl} 
              alt="Uploaded preview" 
              className="max-w-full h-auto rounded"
            />
            <p className="mt-2 text-sm text-gray-600">Current image URL length: {imageUrl.length}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No image uploaded yet</p>
        )}
      </div>
    </div>
  );
};

export default ImageCropTest;