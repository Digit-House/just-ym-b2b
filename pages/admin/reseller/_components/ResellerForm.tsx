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
import { ImageUpload } from "@/components/ImageUpload";

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

  const form = useForm<ResellerFormValues>({
    resolver: zodResolver(resellerSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      active: initialValues?.active ?? true,
      currency: initialValues?.credit?.currency ?? "THB",
      balance: initialValues?.credit?.balance ?? 0,
      relatedImages: initialValues?.credit?.relatedImages || [],
    },
  });

  const { register, handleSubmit, watch, setValue, formState } = form;
  const { errors } = formState;

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const payload =
          mode === "create"
            ? {
                ...values,
                relatedImages: values.relatedImages || [],
              }
            : {
                id: initialValues!.id,
                name: values.name,
                active: values.active,
                relatedImages: values.relatedImages || [],
              };

        onSubmit(payload);
      })}
      className="space-y-6"
    >
      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputField
            label="Reseller Name"
            isRequired
            placeholder="Mg Mg"
            {...register("name")}
            errMsg={errors.name?.message}
          />
        </div>

        <div>
          <InputField
            label="Currency"
            isRequired
            {...register("currency")}
            disabled={true}
            errMsg={errors.currency?.message}
          />
        </div>
      </div>

      {/* Credit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputField
            type="number"
            label="Initial Balance"
            isRequired
            placeholder="1000"
            {...register("balance", { valueAsNumber: true })}
            disabled={isEdit}
            errMsg={errors.balance?.message}
          />
        </div>

        {isEdit && (
          <ReadOnly
            label="Total Usage"
            value={initialValues?.credit.totalUsage.toLocaleString()}
          />
        )}
      </div>

      {/* Related Images */}
      <div>
        <ImageUpload
          label="Related Images"
          value={watch("relatedImages")?.[0] || ""}
          onChange={(val) => setValue("relatedImages", val ? [val] : [])}
          errMsg={errors.relatedImages?.message}
          folderType="CREDIT_TOP_UP"
        />
      </div>

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
            value={new Date(initialValues!.credit.updatedAt).toLocaleString()}
          />
        </div>
      )}

      {/* Active switch */}
      <div className="flex items-center justify-between border rounded-lg px-4 py-3">
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
