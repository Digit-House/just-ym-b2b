"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import TextareaField from "@/components/TextareaField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  paymentMethodSchema,
  PaymentMethodFormValues,
} from "@/types/schema/paymentMethodSchema";
import { Switch } from "@/components/ui/switch";
import { ImageUpload, ImageUploadRef } from "@/components/ImageUpload";
import ImagePreview from "@/components/ImagePreview";
import { getSignedUrlAndImageDataUpload } from "@/util";
import { useState, useRef } from "react";
import { LockKeyhole } from "lucide-react";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  initialValues?: PaymentMethodFormValues & { id?: string };
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: PaymentMethodFormValues & { id?: string }) => void;
};

export default function PaymentMethodForm({
  mode,
  initialValues,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const isEdit = mode === "edit";

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      id: initialValues?.id ?? "",
      name: initialValues?.name ?? "",
      type: initialValues?.type ?? "BANK_TRANSFER",
      bankName: initialValues?.bankName ?? "",
      description: initialValues?.description ?? "",
      accountName: initialValues?.accountName ?? "",
      accountNumber: initialValues?.accountNumber ?? "",
      instructions: initialValues?.instructions ?? "",
      logo: initialValues?.logo ?? "",
      qrCodeUrl: initialValues?.qrCodeUrl ?? "",
      isActive: initialValues?.isActive ?? true,
      currency: initialValues?.currency ?? "MMK",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const type = watch("type");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for ImageUpload components
  const logoImageUploadRef = useRef<ImageUploadRef>(null);
  const qrCodeImageUploadRef = useRef<ImageUploadRef>(null);

  const onSubmitHandler = async (values: PaymentMethodFormValues) => {
    setIsSubmitting(true);
    try {
      // Handle deferred image uploads
      let updatedValues = { ...values };

      // Upload logo if there's a file to upload
      if (logoImageUploadRef.current) {
        const logoFile = logoImageUploadRef.current.getFileToUpload();
        if (logoFile) {
          const result = await getSignedUrlAndImageDataUpload(
            logoFile,
            "CREDIT_TOP_UP"
          );
          if (result.status === 200 && result.url) {
            updatedValues = { ...updatedValues, logo: result.url };
          }
        }
      }

      // Upload QR code if there's a file to upload
      if (type === "QR_CODE" && qrCodeImageUploadRef.current) {
        const qrCodeFile = qrCodeImageUploadRef.current.getFileToUpload();
        if (qrCodeFile) {
          const result = await getSignedUrlAndImageDataUpload(
            qrCodeFile,
            "CREDIT_TOP_UP"
          );
          if (result.status === 200 && result.url) {
            updatedValues = { ...updatedValues, qrCodeUrl: result.url };
          }
        }
      }

      const payload = isEdit
        ? { ...updatedValues, id: initialValues?.id }
        : updatedValues;
      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="space-y-1">
        <label className="text-sm flex items-center gap-2 font-medium">
          Type{" "}
          {mode === "edit" ? (
            <LockKeyhole size={12} className="mb-[1px]" />
          ) : (
            <span className="text-red-500">*</span>
          )}
        </label>

        <Select
          value={type}
          onValueChange={(val) =>
            setValue("type", val as PaymentMethodFormValues["type"])
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
            <SelectItem value="QR_CODE">QR Code</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-xs text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Logo Upload */}
      <ImageUpload
        ref={logoImageUploadRef}
        label="Logo Image"
        value={watch("logo")}
        onChange={(val) => setValue("logo", val)}
        errMsg={errors.logo?.message}
        folderType="CREDIT_TOP_UP"
        maxSizeMB={5}
        allowedTypes={['image/jpeg', 'image/jpg', 'image/png']}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">
          Currency <span className="text-red-500">*</span>
        </label>
        <Select
          value={watch("currency")}
          onValueChange={(val) => setValue("currency", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MMK">MMK (Myanmar Kyat)</SelectItem>
            <SelectItem value="THB">THB (Thai Baht)</SelectItem>
          </SelectContent>
        </Select>
        {errors.currency && (
          <p className="text-xs text-red-500">{errors.currency.message}</p>
        )}
      </div>

      <>
        <InputField
          label="Bank Name"
          isRequired
          placeholder="KBZ"
          {...register("bankName")}
          errMsg={errors.bankName?.message}
        />

        <InputField
          label="Name"
          {...register("name")}
          placeholder="KBZ Pay,AYA Pay"
          isRequired
          errMsg={errors.name?.message}
        />

        <InputField
          label="Account Name"
          isRequired
          placeholder="Mg Mg"
          {...register("accountName")}
          errMsg={errors.accountName?.message}
        />

        {type === "BANK_TRANSFER" && (
          <>
            <InputField
              label="Account Number"
              isRequired
              placeholder="09193939399"
              {...register("accountNumber")}
              errMsg={errors.accountNumber?.message}
            />
          </>
        )}
      </>
      {type === "QR_CODE" && (
        <>
          <ImageUpload
            ref={qrCodeImageUploadRef}
            label="QR Code Image"
            isRequired
            value={watch("qrCodeUrl")}
            onChange={(val) => setValue("qrCodeUrl", val)}
            errMsg={errors.qrCodeUrl?.message}
            folderType="CREDIT_TOP_UP"
            maxSizeMB={5}
            allowedTypes={['image/jpeg', 'image/jpg', 'image/png']}
          />

          {/* QR Code Preview for Edit Mode */}
          {isEdit && watch("qrCodeUrl") && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <ImagePreview
                images={[watch("qrCodeUrl")]}
                title="Current QR Code Preview"
                className="w-full"
              />
            </div>
          )}
        </>
      )}

      <TextareaField
        label="Description"
        rows={4}
        placeholder="Hello Descirption"
        {...register("description")}
        errMsg={errors.description?.message}
      />

      <TextareaField
        label="Instructions"
        rows={4}
        placeholder="Hello Instructions"
        {...register("instructions")}
        errMsg={errors.instructions?.message}
      />

      <div className="flex items-center justify-between border rounded-lg px-4 py-3">
        <span className="text-sm font-medium">Active</span>
        <Switch
          checked={watch("isActive")}
          onCheckedChange={(val) => setValue("isActive", val)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Save Changes" : "Create"}
        </Button>
      </div>
    </form>
  );
}
