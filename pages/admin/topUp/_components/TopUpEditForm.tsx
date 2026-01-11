"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import ReadOnly from "@/components/ReadOnly";
import InputField from "@/components/InputField";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TopUpHistoryT } from "@/types/wallet.type";
import {
  topUpEditSchema,
  TopUpEditValues,
} from "@/types/schema/topUpEditSchema";

type Props = {
  initialValues: TopUpHistoryT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (id: string, topUpBalance: number, status: string) => void;
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
    watch,
    setValue,
  } = useForm<TopUpEditValues>({
    resolver: zodResolver(topUpEditSchema),
    defaultValues: {
      topUpBalance: initialValues.topUpBalance,
      status: initialValues.status,
    },
  });

  const submitHandler = (values: TopUpEditValues) => {
    onSubmit(initialValues.id, values.topUpBalance, values.status);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Read-only info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <ReadOnly label="Reseller" value={initialValues.reseller?.name} />
        <ReadOnly label="Currency" value={initialValues.currency} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <div className="flex gap-2">
            <Select
              value={watch("status")}
              onValueChange={(value) => setValue("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <span
              className={`px-3 py-2 rounded-full text-xs font-medium inline-block min-w-[80px] text-center ${
                watch("status") === "CONFIRMED"
                  ? "bg-green-100 text-green-700"
                  : watch("status") === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {watch("status")}
            </span>
          </div>
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
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

        <Button type="submit" loading={loading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
