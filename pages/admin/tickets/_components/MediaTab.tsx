import React, { useState, useEffect, useRef as reactUseRef } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import {
  ProductInfoT,
  MediaFileT,
  UpdateProductPayloadT,
} from "@/types/product.type";
import InputField from "@/components/InputField";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Upload, X } from "lucide-react";
import { ImageUpload, ImageUploadRef } from "@/components/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef } from "react";
import { getSignedUrlAndImageDataUpload } from "@/util";

type MediaTabProps = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  setValue: any;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT | ProductInfoT;
  setMediaItemRef?: (index: number) => (ref: ImageUploadRef | null) => void;
};

const MediaTab: React.FC<MediaTabProps> = ({
  control,
  errors,
  initialValues,
  setMediaItemRef,
}) => {
  // State for media items
  const [mediaItems, setMediaItems] = useState<MediaFileT[]>(
    (initialValues as UpdateProductPayloadT)?.media ?? []
  );

  // Refs for ImageUpload components
  const mediaItemRefs = React.useRef<Map<number, ImageUploadRef>>(new Map());

  // Use the provided ref function if available, otherwise use local ref management
  const setImageUploadRef = (index: number) => (ref: ImageUploadRef | null) => {
    if (setMediaItemRef) {
      // Use the ref function provided by parent component
      setMediaItemRef(index)(ref);
    } else {
      // Use local ref management
      if (ref) {
        mediaItemRefs.current.set(index, ref);
      } else {
        mediaItemRefs.current.delete(index);
      }
    }
  };

  const addMediaItem = () => {
    setMediaItems((prev) => [
      ...prev,
      {
        type: null,
        size: null,
        path: null,
        name: null,
        isPublished: null,
        extension: null,
      },
    ]);
  };

  const removeMediaItem = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMediaItem = (
    index: number,
    field: keyof (typeof mediaItems)[0],
    value: string | number | boolean | null
  ) => {
    setMediaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // This will be updated when we have file information
  const handleMediaItemImageUpload = (index: number, imageUrl: string, file?: File) => {
    // If we have the original file object, extract information from it
    let name = null;
    let extension = null;
    let size = null;
    let type = null;
    
    if (file) {
      // Extract name and extension from the file object
      const originalName = file.name;
      const lastDotIndex = originalName.lastIndexOf('.');
      
      if (lastDotIndex !== -1) {
        name = originalName.substring(0, lastDotIndex);
        extension = originalName.substring(lastDotIndex + 1).toLowerCase();
      } else {
        // If no extension, use the whole name
        name = originalName;
      }
      
      size = file.size;
      type = file.type;
    } else {
      // Fallback to extracting from URL if file object isn't available
      const fileName = imageUrl.split('/').pop() || '';
      const lastDotIndex = fileName.lastIndexOf('.');
      
      if (lastDotIndex !== -1) {
        name = fileName.substring(0, lastDotIndex);
        extension = fileName.substring(lastDotIndex + 1).toLowerCase();
      } else {
        // If no extension, use the whole name
        name = fileName;
      }
    }
    
    updateMediaItem(index, 'path', imageUrl);
    updateMediaItem(index, 'name', name);
    updateMediaItem(index, 'extension', extension);
    updateMediaItem(index, 'size', size);
    updateMediaItem(index, 'type', type);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-indigo-600"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M21 15l-5-5L5 21"></path>
          </svg>
          Media & Images
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage the ticket's visual content
        </p>
      </div>

      <div className="space-y-6">

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-indigo-600"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M21 15l-5-5L5 21"></path>
              </svg>
              <h4 className="text-lg font-medium">Media Items</h4>
            </div>
            <Button
              type="button"
              onClick={addMediaItem}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Media
            </Button>
          </div>

          <div className="space-y-4">
            {mediaItems?.map((media, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border grid grid-cols-1  gap-4 ${
                  errors.media?.[index]
                    ? "bg-red-50 border-red-300"
                    : "bg-gray-50"
                }`}
              >
                <div
                  className={`${
                    errors.media?.[index]?.path
                      ? "border border-red-300 rounded-lg p-2 bg-red-50"
                      : ""
                  }`}
                >
                  <ImageUpload
                    ref={setImageUploadRef(index)}
                    label="Media Image"
                    value={media.path}
                    onChange={(val, file) => {
                      // Update the path with the preview URL for now
                      updateMediaItem(index, 'path', val);
                      // Auto-fill name, extension, type, and size if file is available
                      if (file) {
                        handleMediaItemImageUpload(index, val, file);
                      }
                    }}
                    folderType="PRODUCT_MEDIA"
                  />
                </div>
                <div
                  className={`${
                    errors.media?.[index]?.name
                      ? "border border-red-300 rounded-lg p-2 bg-red-50"
                      : ""
                  }`}
                >
                  <InputField
                    label="Name"
                    value={media.name || ""}
                    onChange={(e) =>
                      updateMediaItem(index, "name", e.target.value)
                    }
                    placeholder="Name"
                  />
                </div>
                <div
                  className={`${
                    errors.media?.[index]?.extension
                      ? "border border-red-300 rounded-lg p-2 bg-red-50"
                      : ""
                  }`}
                >
                  <InputField
                    label="Extension"
                    value={media.extension || ""}
                    onChange={(e) =>
                      updateMediaItem(index, "extension", e.target.value)
                    }
                    placeholder="Extension"
                  />
                </div>
                <div
                  className={`${
                    errors.media?.[index]?.type
                      ? "border border-red-300 rounded-lg p-2 bg-red-50"
                      : ""
                  }`}
                >
                  <InputField
                    label="Type"
                    value={media.type || ""}
                    onChange={(e) =>
                      updateMediaItem(index, "type", e.target.value)
                    }
                    placeholder="Type"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <div
                      className={`${
                        errors.media?.[index]?.size
                          ? "border border-red-300 rounded-lg p-2 bg-red-50"
                          : ""
                      }`}
                    >
                      <InputField
                        label="Size (bytes)"
                        type="number"
                        value={media.size || 0}
                        onChange={(e) =>
                          updateMediaItem(
                            index,
                            "size",
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="Size"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`published-${index}`}
                        checked={Boolean(media.isPublished)}
                        onCheckedChange={(checked) =>
                          updateMediaItem(index, "isPublished", checked)
                        }
                      />
                      <Label
                        htmlFor={`published-${index}`}
                        className="text-sm font-normal"
                      >
                        Published
                      </Label>
                    </div>
                    <div className="flex items-end pb-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMediaItem(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTab;