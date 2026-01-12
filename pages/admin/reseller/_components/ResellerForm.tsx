"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import ReadOnly from "@/components/ReadOnly";
import { ResellerT } from "@/types/reseller.type";
import {
  ResellerFormValues,
  resellerSchema,
} from "@/types/schema/resellerSchema";
import InputField from "@/components/InputField";
import { useRef } from "react";
import { ImageUpload, ImageUploadRef } from "@/components/ImageUpload";
import { getSignedUrlAndImageDataUpload } from "@/util";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  initialValues?: ResellerT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: any) => void;
};

export default function ResellerForm({
  mode,
  initialValues,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResellerFormValues>({
    resolver: zodResolver(resellerSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      active: initialValues?.active ?? true,
      currency: initialValues?.credit?.currency ?? "THB",
      balance: initialValues?.credit?.balance ?? 0,
      relatedImages: initialValues?.credit?.relatedImages ?? [],
    },
  });

  const relatedImagesRef = useRef<ImageUploadRef>(null);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        // Handle deferred image uploads
        let updatedValues = { ...values };
        
        // Upload related images if there's a file to upload
        if (relatedImagesRef.current) {
          const relatedImageFile = relatedImagesRef.current.getFileToUpload();
          if (relatedImageFile) {
            const result = await getSignedUrlAndImageDataUpload(relatedImageFile, "CREDIT_TOP_UP");
            if (result.status === 200 && result.url) {
              updatedValues = { ...updatedValues, relatedImages: [result.url] };
            }
          }
        }
        
        const payload =
          mode === "create"
            ? updatedValues
            : {
                id: initialValues!.id,
                ...updatedValues,
              };

        onSubmit(payload);
      })}
      className="space-y-6"
    >
      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Reseller Name"
          isRequired
          placeholder="Mg Mg"
          {...register("name")}
          errMsg={errors.name?.message}
        />

        <InputField
          label="Currency"
          isRequired
          {...register("currency")}
          disabled
          errMsg={errors.currency?.message}
        />
      </div>

      {/* Credit */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          type="number"
          label="Initial Balance"
          isRequired
          placeholder="1000"
          {...register("balance", { valueAsNumber: true })}
          disabled={isEdit}
          errMsg={errors.balance?.message}
        />

        {isEdit && (
          <ReadOnly
            label="Total Usage"
            value={initialValues?.credit.totalUsage.toLocaleString()}
          />
        )}
      </div>

      {/* Related Images */}
      <ImageUpload
        ref={relatedImagesRef}
        label="Related Images"
        isRequired
        value={watch("relatedImages")?.[0] || ""}
        onChange={(val) =>
          setValue("relatedImages", val ? [val] : [], {
            shouldValidate: true,
          })
        }
        errMsg={errors.relatedImages?.message as string}
        folderType="CREDIT_TOP_UP"
      />

      {/* Edit-only info */}
      {isEdit && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <ReadOnly
            label="Total Top-up"
            value={initialValues?.credit.totalTopUp.toLocaleString()}
          />
          <ReadOnly
            label="Outstanding Debt"
            value={initialValues?.credit.hasOutstandingDebt ? "Yes" : "No"}
          />
          <ReadOnly
            label="Last Updated"
            value={new Date(
              initialValues!.credit.updatedAt
            ).toLocaleString()}
          />
        </div>
      )}

      {/* Active */}
      <div className="flex items-center justify-between rounded-lg border px-4 py-3">
        <div>
          <p className="font-medium">Active</p>
          <p className="text-xs text-gray-500">
            Control reseller account access
          </p>
        </div>
        <Switch
          checked={watch("active")}
          onCheckedChange={(val) => setValue("active", val)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Create Reseller" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
