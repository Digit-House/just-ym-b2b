"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import ImageUpload, { ImageUploadRef } from "@/components/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CategoryFormValues, categorySchema } from "@/types/schema/categorySchema";
import { CategoryT } from "@/types/categories.type";
import { getSignedUrlAndImageDataUpload } from "@/util";

type Props = {
  mode: "edit";
  category?: CategoryT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: CategoryFormValues) => void;
};

export default function CategoryForm({
  mode,
  category,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const isEdit = mode === "edit";
  const imageUploadRef = useRef<ImageUploadRef>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: category?.id ?? "",
      name: category?.name ?? "",
      name_mm: category?.name_mm ?? "",
      image: category?.image ?? "",
      showOnLanding: category?.showOnLanding ?? false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const watchShowOnLanding = watch("showOnLanding");
  const watchImage = watch("image");

  // Debug useEffect to monitor image changes
  // React.useEffect(() => {
  //   console.log("Image value changed:", watchImage);
  // }, [watchImage]);

  const submitHandler = async (values: CategoryFormValues) => {
    
  
    try {
      let processedImage = values.image;
      
     
      if (imageUploadRef.current) {
        const fileToUpload = imageUploadRef.current.getFileToUpload();
        
        if (fileToUpload) {
          const result = await getSignedUrlAndImageDataUpload(
            fileToUpload,
            "PRODUCT_MEDIA"
          );
          if (result.status === 200 && result.url) {
            processedImage = result.url;
          }
        }
      }
      if (
        processedImage &&
        (processedImage.startsWith("blob:") || processedImage.startsWith("data:"))
      ) {
        if (imageUploadRef.current) {
          const fileToUpload = imageUploadRef.current.getFileToUpload();
          if (fileToUpload) {
            const result = await getSignedUrlAndImageDataUpload(
              fileToUpload,
              "PRODUCT_MEDIA"
            );
            if (result.status === 200 && result.url) {
              processedImage = result.url;
            }
          }
        }
      }

      // Submit with processed data
      const processedValues = {
        ...values,
        image: processedImage
      };
      
      onSubmit(processedValues);
    } catch (error) {
      console.error("Error processing form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <InputField
        label="Name"
        {...register("name")}
        isRequired={true}
        disabled={true}
        errMsg={errors.name?.message}
      />

      <InputField
        label="Name (MM)"
        {...register("name_mm")}
        errMsg={errors.name_mm?.message}
      />

      <ImageUpload
        ref={imageUploadRef}
        label="Category Image"
        value={watchImage}
        onChange={(val, file) => {
          setValue("image", val);
        }}
        errMsg={errors.image?.message}
        folderType="PRODUCT_MEDIA"
        enableCrop
        presetCropSetting="CATEGORY_IMAGE"
        mode={mode}
        cropLibrary="react-easy-crop"
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="showOnLanding"
          checked={watchShowOnLanding}
          onCheckedChange={(checked) => setValue("showOnLanding", !!checked)}
        />
        <Label htmlFor="showOnLanding" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Show on Landing Page
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" loading={loading}>
          {isEdit ? "Save Changes" : "Create"}
        </Button>
      </div>
    </form>
  );
}
