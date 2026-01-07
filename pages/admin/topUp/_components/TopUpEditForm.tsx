"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import ReadOnly from "@/components/ReadOnly";
import InputField from "@/components/InputField";

import { TopUpHistoryT } from "@/types/wallet.type";
import {
  topUpEditSchema,
  TopUpEditValues,
} from "@/types/schema/topUpEditSchema";

type Props = {
  initialValues: TopUpHistoryT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (id: string, topUpBalance: number) => void;
};

export default function TopUpEditForm({
  initialValues,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TopUpEditValues>({
    resolver: zodResolver(topUpEditSchema),
    defaultValues: {
      topUpBalance: initialValues.topUpBalance,
    },
  });

  const submitHandler = (values: TopUpEditValues) => {
    onSubmit(initialValues.id, values.topUpBalance);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Read-only info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <ReadOnly label="Reseller" value={initialValues.reseller?.name} />
        <ReadOnly label="Currency" value={initialValues.currency} />
        <ReadOnly label="Status" value={initialValues.status} />
        <ReadOnly label="Created By" value={initialValues.createdBy?.email} />
        <ReadOnly
          label="Created At"
          value={new Date(initialValues.createdAt).toLocaleString()}
        />
        <ReadOnly
          label="Last Updated"
          value={new Date(initialValues.updatedAt).toLocaleString()}
        />
      </div>

      {/* Editable field */}
      <InputField
        label="Top-up Balance"
        type="number"
        {...register("topUpBalance", { valueAsNumber: true })}
        errMsg={errors.topUpBalance?.message}
      />

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" loading={loading} disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
