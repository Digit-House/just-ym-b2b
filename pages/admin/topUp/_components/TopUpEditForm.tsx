"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import ReadOnly from "@/components/ReadOnly";
import InputField from "@/components/InputField";
import ImagePreview from "@/components/ImagePreview";
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


const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  REJECTED: "bg-red-50 text-red-700",
};

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
    formState: { errors },
    watch,
    setValue,
  } = useForm<TopUpEditValues>({
    resolver: zodResolver(topUpEditSchema),
    defaultValues: {
      topUpBalance: initialValues.topUpBalance,
      status: initialValues.status,
    },
  });

  const status = watch("status");

  const submitHandler = (values: TopUpEditValues) => {
    onSubmit(initialValues.id, values.topUpBalance, values.status);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <ReadOnly label="Reseller" value={initialValues.reseller?.name} />
        <ReadOnly label="Currency" value={initialValues.currency} />
        <ReadOnly label="Created By" value={initialValues.createdBy?.email} />
        <ReadOnly label="Confirm By" value={initialValues.confirmBy?.email} />
        <ReadOnly
          label="Created At"
          value={new Date(initialValues.createdAt).toLocaleString()}
        />
        <ReadOnly
          label="Last Updated"
          value={new Date(initialValues.updatedAt).toLocaleString()}
        />



        {initialValues.paymentMethod && (
          <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-2">Payment Method Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ReadOnly label="Bank Name" value={initialValues.paymentMethod.bankName} />
              <ReadOnly label="Account Number" value={initialValues.paymentMethod.accountNumber} />
              <ReadOnly label="Account Name" value={initialValues.paymentMethod.accountName} />
              <ReadOnly label="Currency" value={initialValues.paymentMethod.currency} />
            </div>
          </div>
        )}
        {initialValues.paymentMethod && (
          <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-2">Currency Rage</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ReadOnly label="Mmk" value={initialValues.currencyRate.mmk} />
              <ReadOnly label="Currency" value={initialValues.currencyRate.id} />
              <ReadOnly label="Created At" value={initialValues.currencyRate.createdAt} />
              <ReadOnly label="Update At" value={initialValues.currencyRate.updatedAt} />
            </div>
          </div>
        )}
        <div className="col-span-2">
          <ImagePreview 
            images={initialValues.relatedImages || []}
            title="Top-up Related Images"
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Status  <span className="text-red-500">*</span>
        </label>

        <div className="flex gap-2">
          <Select
            value={status}
            disabled={initialValues.status ==="CONFIRMED"}
            onValueChange={(value) => setValue("status", value)}
          >
            <SelectTrigger
              className={`w-full capitalize ${STATUS_STYLE[status]}`}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="PENDING"
                  className="text-yellow-700 focus:bg-yellow-50"
                >
                  🟡 Pending
                </SelectItem>

                <SelectItem
                  value="CONFIRMED"
                  className="text-green-700 focus:bg-green-50"
                >
                  🟢 Confirmed
                </SelectItem>

                <SelectItem
                  value="REJECTED"
                  className="text-red-700 focus:bg-red-50"
                >
                  🔴 Rejected
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {errors.status && (
          <p className="mt-1 text-sm text-red-500">
            {errors.status.message}
          </p>
        )}
      </div>

      <InputField
        label="Top-up Balance"
        isRequired
        type="number"
        {...register("topUpBalance", { valueAsNumber: true })}
        errMsg={errors.topUpBalance?.message}
      />

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
