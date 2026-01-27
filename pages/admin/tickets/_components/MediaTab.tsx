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
import { Plus, Trash2 } from "lucide-react";
import { ImageUpload, ImageUploadRef } from "@/components/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef } from "react";

// Simple ID generator function
const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

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
  watch,
  setValue,
  mode,
  initialValues,
  setMediaItemRef,
}) => {
  // Use a ref to store the initial media items to prevent re-initialization
  const initialMediaItemsRef = useRef<MediaFileT[] | null>(null);
  const hasInitializedFromFormRef = useRef<boolean>(false);
  
  // Initialize the ref with initial values only once
  if (initialMediaItemsRef.current === null) {
    initialMediaItemsRef.current = (initialValues as UpdateProductPayloadT)?.media ?? [];
  }
  
  // State for media items with unique IDs
  const [mediaItems, setMediaItems] = useState<(MediaFileT & { id: string })[]>(
    initialMediaItemsRef.current.map(item => ({
      ...item,
      id: generateId()
    }))
  );
  
  // Initialize from form state on mount if available
  useEffect(() => {
    if (!hasInitializedFromFormRef.current) {
      const formMedia = watch('media');
      if (formMedia && Array.isArray(formMedia) && formMedia.length > 0) {
        setMediaItems(formMedia.map(item => ({
          ...item,
          id: generateId()
        })));
      }
      hasInitializedFromFormRef.current = true;
    }
  }, [watch('media')]);
  
  // Synchronize media items with form state (without the id field)
  useEffect(() => {
    const mediaWithoutIds = mediaItems.map(({ id, ...rest }) => rest);
    setValue('media', mediaWithoutIds);
  }, [mediaItems, setValue]);
  
  // Watch for external changes to media in form state and update local state
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'media' && type === 'change') {
        const currentFormMedia = value.media;
        if (currentFormMedia && Array.isArray(currentFormMedia)) {
          // Compare without considering ids
          const formMediaWithoutIds = currentFormMedia.map(item => JSON.stringify({
            type: item.type,
            size: item.size,
            path: item.path,
            name: item.name,
            isPublished: item.isPublished,
            extension: item.extension
          }));
          
          const localMediaWithoutIds = mediaItems.map(item => JSON.stringify({
            type: item.type,
            size: item.size,
            path: item.path,
            name: item.name,
            isPublished: item.isPublished,
            extension: item.extension
          }));
          
          if (JSON.stringify(formMediaWithoutIds) !== JSON.stringify(localMediaWithoutIds)) {
            setMediaItems(currentFormMedia.map(item => ({
              ...item,
              id: generateId()
            })));
          }
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, mediaItems]);
  

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
        id: generateId(),
        type: null,
        size: null,
        path: null,
        name: null,
        isPublished: null,
        extension: null,
      },
    ]);
  };

  const removeMediaItem = (itemId: string) => {
    setMediaItems((prev) => prev.filter(item => item.id !== itemId));
  };

  const updateMediaItem = (
    itemId: string,
    field: keyof (typeof mediaItems)[0],
    value: string | number | boolean | null
  ) => {
    setMediaItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, [field]: value } : item))
    );
  };

  // This will be updated when we have file information
  const handleMediaItemImageUpload = (itemId: string, imageUrl: string, file?: File) => {
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
    
    updateMediaItem(itemId, 'path', imageUrl);
    updateMediaItem(itemId, 'name', name);
    updateMediaItem(itemId, 'extension', extension);
    updateMediaItem(itemId, 'size', size);
    updateMediaItem(itemId, 'type', type);
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
            {mediaItems?.map((media) => (
              <div
                key={media.id}
                className={`p-4 rounded-lg border grid grid-cols-1  gap-4 ${
                  errors.media?.[mediaItems.findIndex(item => item.id === media.id)]
                    ? "bg-red-50 border-red-300"
                    : "bg-gray-50"
                }`}
              >
                <div
                  className={`${
                    errors.media?.[mediaItems.findIndex(item => item.id === media.id)]?.path
                      ? "border border-red-300 rounded-lg p-2 bg-red-50"
                      : ""
                  }`}
                >
                  <ImageUpload
                    ref={setImageUploadRef(mediaItems.findIndex(item => item.id === media.id))}
                    label="Media Image"
                    value={media.path}
                    onChange={(val, file) => {
                      updateMediaItem(media.id, 'path', val);
                      if (file) {
                        handleMediaItemImageUpload(media.id, val, file);
                      }
                    }}
                    folderType="PRODUCT_MEDIA"
                    enableCrop={true}
                    presetCropSetting="GET_INSPIRED_BIG"
                  />
                </div>
                {/* Hidden Name Input Field */}
                <div className="hidden">
                  <InputField
                    label="Name"
                    value={media.name || ""}
                    onChange={(e) =>
                      updateMediaItem(media.id, "name", e.target.value)
                    }
                    placeholder="Name"
                  />
                </div>
                <div className="hidden">
                  <InputField
                    label="Extension"
                    value={media.extension || ""}
                    onChange={(e) =>
                      updateMediaItem(media.id, "extension", e.target.value)
                    }
                    placeholder="Extension"
                  />
                </div>
                <div className="hidden">
                  <InputField
                    label="Type"
                    value={media.type || ""}
                    onChange={(e) =>
                      updateMediaItem(media.id, "type", e.target.value)
                    }
                    placeholder="Type"
                  />
                </div>
                <div className="flex gap-2">
                  {/* Hidden Size Input Field */}
                  <div className="flex-grow hidden">
                    <div
                      className={`${
                        errors.media?.[mediaItems.findIndex(item => item.id === media.id)]?.size
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
                            media.id,
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
                        id={`published-${media.id}`}
                        checked={Boolean(media.isPublished)}
                        onCheckedChange={(checked) =>
                          updateMediaItem(media.id, "isPublished", checked)
                        }
                      />
                      <Label
                        htmlFor={`published-${media.id}`}
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
                        onClick={() => removeMediaItem(media.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
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