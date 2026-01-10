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
import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";

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

  const onSubmitHandler = async (values: PaymentMethodFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = isEdit ? { ...values, id: initialValues?.id } : values;
      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="space-y-1">
        <label className="text-sm font-medium">
          Type <span className="text-red-500">*</span>
        </label>
        <Select
          value={type}
          onValueChange={(val) =>
            setValue("type", val as PaymentMethodFormValues["type"])
          }
          disabled={isEdit}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
            <SelectItem value="QR_CODE">QR Code</SelectItem>
            {/* <SelectItem value="OTHER">Other</SelectItem> */}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-xs text-red-500">{errors.type.message}</p>
        )}
      </div>

      <>
        <InputField
          label="Name"
          {...register("name")}
          placeholder="KBZ Pay,AYA Pay"
          isRequired
          errMsg={errors.name?.message}
        />

        <InputField
          label="Bank Name"
          isRequired
          placeholder="KBZ"
          {...register("bankName")}
          errMsg={errors.bankName?.message}
        />

        {type === "BANK_TRANSFER" && (
          <>
            <InputField
              label="Account Name"
              isRequired
              placeholder="Mg Mg"
              {...register("accountName")}
              errMsg={errors.accountName?.message}
            />

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

      <ImageUpload
        label="Logo Image"
        value={watch("logo")}
        onChange={(val) => setValue("logo", val)}
        errMsg={errors.logo?.message}
        folderType="CREDIT_TOP_UP"
      />

      {type === "QR_CODE" && (
        <ImageUpload
          label="QR Code Image"
          value={watch("qrCodeUrl")}
          onChange={(val) => setValue("qrCodeUrl", val)}
          errMsg={errors.qrCodeUrl?.message}
          folderType="CREDIT_TOP_UP"
        />
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
