"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import { RoleFormValues, roleSchema } from "@/types/schema/roleSchema";
import { CategoryFormValues, categorySchema } from "@/types/schema/categorySchema";

type Props = {
  mode: "create" | "edit";
  name?: string;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: CategoryFormValues & { id?: string }) => void;
};

export default function CategoryForm({
  mode,
  name,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const isEdit = mode === "edit";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: name ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <InputField
        label="Name"
        {...register("name")}
        errMsg={errors.name?.message}
      />

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit"  loading={loading}>
          {isEdit ? "Save Changes" : "Create"}
        </Button>
      </div>
    </form>
  );
}
