import React, { useState } from "react";
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
import { Plus, Minus } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";

type MediaTabProps = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  setValue: any;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT;
};

const MediaTab: React.FC<MediaTabProps> = ({
  control,
  errors,
  initialValues,
}) => {
  // State for media items
  const [mediaItems, setMediaItems] = useState<MediaFileT[]>(
    initialValues?.media ?? []
  );

  const addMediaItem = () => {
    setMediaItems((prev) => [
      ...prev,
      {
        extension: "",
        name: "",
        path: "",
        size: 0,
        type: "",
        isPublished: false,
      },
    ]);
  };

  const removeMediaItem = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMediaItem = (
    index: number,
    field: keyof (typeof mediaItems)[0],
    value: string | number
  ) => {
    setMediaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
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
        <div
          className={`space-y-4 ${
            errors.image ? "border border-red-300 rounded-lg p-3 bg-red-50" : ""
          }`}
        >
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label="Main Image"
                value={field.value}
                onChange={field.onChange}
                errMsg={errors.image?.message}
                folderType="PRODUCT_MEDIA"
              />
            )}
          />
        </div>

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
              <h4 className="text-lg font-medium">Additional Media Items</h4>
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
            {mediaItems.map((media, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${
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
                  <Label>Image Path</Label>
                  <InputField
                    label="Image Path"
                    value={media.path}
                    onChange={(e) =>
                      updateMediaItem(index, "path", e.target.value)
                    }
                    placeholder="Image path"
                  />
                </div>
                <div
                  className={`${
                    errors.media?.[index]?.name
                      ? "border border-red-300 rounded-lg p-2 bg-red-50"
                      : ""
                  }`}
                >
                  <Label>Name</Label>
                  <InputField
                    label="Name"
                    value={media.name}
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
                  <Label>Extension</Label>
                  <InputField
                    label="Extension"
                    value={media.extension}
                    onChange={(e) =>
                      updateMediaItem(index, "extension", e.target.value)
                    }
                    placeholder="Extension"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <Label>Size (bytes)</Label>
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
                        value={media.size}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTab;
