"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminTopup } from "@/graphql/wallet";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputField from "@/components/InputField";

import { adminTopupSchema, AdminTopupValues } from "@/types/schema/topupSchema";
import { useUser } from "@/provider/UserProvider";

type Props = {
  loading?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function AdminTopUpForm({ loading, onCancel, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AdminTopupValues>({
    resolver: zodResolver(adminTopupSchema),
    defaultValues: {
      amount: 0,
      from: "CUSTOMER",
    },
  });

  const from = watch("from");

  const submitHandler = async (values: AdminTopupValues) => {
    try {
      await adminTopup({
        amount: values.amount,
        from: values.from,
      });
      toast.success("Admin top-up successful!");
      onSubmit();
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Source <span className="text-red-500">*</span>
          </label>
          
          <Select
            value={from}
            onValueChange={(value) => setValue("from", value as "CUSTOMER" | "MAIN")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            
            <SelectContent>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
              <SelectItem value="MAIN">Main</SelectItem>
            </SelectContent>
          </Select>
          
          {errors.from && (
            <p className="mt-1 text-sm text-red-500">
              {errors.from.message}
            </p>
          )}
        </div>

        <InputField
          label="Amount"
          isRequired
          type="number"
          step="0.01"
          min="0"
          {...register("amount", { valueAsNumber: true })}
          errMsg={errors.amount?.message}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        
        <Button type="submit" loading={loading}>
          Submit Top-up
        </Button>
      </div>
    </form>
  );
}