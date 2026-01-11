"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import { RoleFormValues, roleSchema } from "@/types/schema/roleSchema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TextareaField from "@/components/TextareaField";



type Mode = "create" | "edit";

type ResellerOption = {
  label: string;
  value: string;
};

type Props = {
  mode: Mode;
  initialValues?: RoleFormValues;
  resellerOptions: ResellerOption[];
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: RoleFormValues & { id?: string }) => void;
};

export default function RoleForm({
  mode,
  initialValues,
  resellerOptions,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const isEdit = mode === "edit";

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      resellerId: initialValues?.resellerId ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const payload = isEdit
          ? { ...values, id: initialValues?.resellerId }
          : values;

        onSubmit(payload);
      })}
      className="space-y-6"
    >

      <InputField
        label="Name"
        placeholder="MANAGER"
        {...register("name")}
        isRequired
        errMsg={errors.name?.message}
      />

      <TextareaField
        label="Description"
        rows={4}
        placeholder="Hello Description"
        {...register("description")}
        isRequired
        errMsg={errors.description?.message}
      />
      
      <div className="space-y-1">
        <label className="text-sm font-medium">Reseller</label>
        <Select
          value={watch("resellerId")}
          onValueChange={(val) => setValue("resellerId", val)}
          // disabled={isEdit}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select reseller" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {resellerOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.resellerId && (
          <p className="text-xs text-red-500">
            {errors.resellerId.message}
          </p>
        )}
      </div>

      {/* Actions */}
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
