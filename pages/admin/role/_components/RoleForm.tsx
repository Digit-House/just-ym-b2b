"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import TextareaField from "@/components/TextareaField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleFormValues, roleSchema } from "@/types/schema/roleSchema";

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

const ROLE_OPTIONS = [
  { label: "ADMIN", value: "ADMIN" },
  { label: "MANAGER", value: "MANAGER" },
];

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
      {/* Role Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium">
          Name <span className="text-red-500">*</span>
        </label>

        <Select
          value={watch("name")}
          onValueChange={(val) =>
            setValue("name", val, { shouldValidate: true })
          }
          // disabled={isEdit} // optional
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role name" />
          </SelectTrigger>

          <SelectContent>
            {ROLE_OPTIONS.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <TextareaField
        label="Description"
        rows={4}
        placeholder="Hello Description"
        {...form.register("description")}
        isRequired
        errMsg={errors.description?.message}
      />

      {/* Reseller */}
      <div className="space-y-1">
        <label className="text-sm font-medium">
          Reseller <span className="text-red-500">*</span>
        </label>

        <Select
          value={watch("resellerId")}
          onValueChange={(val) =>
            setValue("resellerId", val, { shouldValidate: true })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select reseller" />
          </SelectTrigger>

          <SelectContent>
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
