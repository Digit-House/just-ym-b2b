"use client";

import InputField from "@/components/InputField";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { format, startOfDay } from "date-fns";
import { CalendarIcon, Copy, Plus } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VoucherFormValues, voucherSchema } from "@/types/schema/voucherSchema";
import {
  VOUCHER_DETAIL_DATA_TYPE,
  VOUCHER_DISCOUNT_TYPE_ENUM,
  VOUCHER_SPECIAL_DAY_ENUM,
} from "@/types/voucher.type";
import { Switch } from "@/components/ui/switch";
import { submitVoucher, updateVoucher } from "@/graphql/voucher";
import {
  VoucherCreateInputDTO,
  VoucherUpdateInputDTO,
} from "@/graphql/type-query/voucher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";

type Props = {
  data?: VOUCHER_DETAIL_DATA_TYPE | null;
};

const VoucherForm = ({ data }: Props) => {
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      active: data?.active || false,
      name: data?.name || "",
      description: data?.description || "",
      discountType: data?.discountType || undefined,
      discountValue: data?.discountValue || undefined,
      startDate: data?.startDate ? new Date(data?.startDate) : undefined,
      endDate: data?.endDate ? new Date(data?.endDate) : undefined,
      minPurchase: typeof data?.minPurchase === "number" ? data.minPurchase : undefined,
      minQuantity: data?.minQuantity || undefined,
      maximumAmount: data?.maximumAmount || undefined,
      usageLimit: data?.usageLimit || undefined,
      specialDay: data?.specialDay || undefined,
      description_mm: data?.description_mm || "",
      name_mm: data?.name_mm || "",
      isCodeOnly: data?.isCodeOnly || false,
      codePrefix: data?.codePrefix || "",
      // `codes` on `data` is the list of already-generated codes, not a
      // batch request — there's nothing to prefill here.
      codes: {
        comment: "",
        count: undefined,
      },
      // On create there's no existing panel to open, so new codes are
      // always requested up front. On edit it's opt-in via the button.
      addCodeRequested: !data,
      codeUpdates:
        data?.codes.map((code) => ({
          id: code.id,
          code: code.code,
          redeemedAt: code.redeemedAt,
          active: code.active,
          comment: code.comment || "",
        })) || [],
    },
  });

  const { fields: codeFields } = useFieldArray({
    control,
    name: "codeUpdates",
  });

  const specialDay = watch("specialDay");
  const startDate = watch("startDate");
  const isCodeOnly = watch("isCodeOnly");
  const addCodeRequested = watch("addCodeRequested");

  const handleCopyCode = async (code?: string) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const onSubmit = async (values: VoucherFormValues) => {
    setLoading(true);
    if (data) {
      const updateData: VoucherUpdateInputDTO = {
        active: values.active,
        description: values.description,
        discountType: values.discountType,
        discountValue: values.discountValue,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        maximumAmount:
          typeof values.maximumAmount === "number"
            ? values.maximumAmount
            : null,
        minPurchase: values.minPurchase,
        minQuantity: values.minQuantity,
        name: values.name,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        usageLimit: values.usageLimit,
        specialDay: values.specialDay || null,
        name_mm: values.name_mm,
        description_mm: values.description_mm,
        id: data.id,
        isCodeOnly: values.isCodeOnly,
        codePrefix: values.isCodeOnly ? values.codePrefix || null : null,
        codes:
          values.isCodeOnly && values.addCodeRequested
            ? {
                comment: values.codes?.comment || null,
                count:
                  typeof values.codes?.count === "number"
                    ? values.codes.count
                    : null,
              }
            : null,
        codeUpdates: values.isCodeOnly
          ? (values.codeUpdates || []).map((codeUpdate) => ({
              id: codeUpdate.id,
              active: codeUpdate.active,
              comment: codeUpdate.comment || null,
            }))
          : [],
      };
      try {
        const res = await updateVoucher(updateData);
        if (res.data) {
          toast.success("Successfully Updated");
          reset();
          navigate("/vouchers");
        }
      } catch (err: any) {
        toast.error(getErrMsg(err, "message"));
      } finally {
        setLoading(false);
      }
    } else {
      const data: VoucherCreateInputDTO = {
        active: values.active,
        description: values.description,
        discountType: values.discountType,
        discountValue: values.discountValue,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        maximumAmount:
          typeof values.maximumAmount === "number"
            ? values.maximumAmount
            : null,
        minPurchase: values.minPurchase,
        minQuantity: values.minQuantity,
        name: values.name,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        usageLimit: values.usageLimit,
        name_mm: values.name_mm,
        description_mm: values.description_mm,
        specialDay: values.specialDay || null,
        isCodeOnly: values.isCodeOnly,
        codePrefix: values.isCodeOnly ? values.codePrefix || null : null,
        codes: values.isCodeOnly
          ? {
              comment: values.codes?.comment || null,
              count:
                typeof values.codes?.count === "number"
                  ? values.codes.count
                  : null,
            }
          : null,
      };
      try {
        const res = await submitVoucher(data);
        if (res.data) {
          toast.success("Successfully Submitted");
          reset();
          navigate("/vouchers");
        }
      } catch (err: any) {
        toast.error(getErrMsg(err, "message"));
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (specialDay) {
      setValue("startDate", undefined);
      setValue("endDate", undefined);
    }
  }, [specialDay, setValue]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
      >
        {/* Active */}
        <div className="flex items-center justify-between  rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="text-xs text-muted-foreground">
              Enable or disable this voucher
            </p>
          </div>

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        {/* Is Code Only */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium">Code Only</p>
            <p className="text-xs text-muted-foreground">
              Generate unique codes for this voucher
            </p>
          </div>

          <Controller
            control={control}
            name="isCodeOnly"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!!data}
              />
            )}
          />
        </div>

        {/* Existing codes (edit mode only, read-only) */}
        {isCodeOnly && !!data && codeFields.length > 0 && (
          <div className="col-span-2 grid grid-cols-5 gap-2">
            {codeFields.map((field) => (
              <div
                key={field.id}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 ${
                  !field.redeemedAt ? "bg-indigo-100" : "bg-[#FFEBEE]"
                }`}
              >
                <span
                  className={`font-mono text-sm font-bold ${
                    !field.redeemedAt ? "text-indigo-700" : "text-[#D32F2F]"
                  }`}
                >
                  {field.code}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyCode(field.code)}
                  disabled={field.redeemedAt ? true : false}
                  title={!field.redeemedAt ? "Copy code" : "Code inactive"}
                  className={
                    !field.redeemedAt
                      ? "text-indigo-700 hover:text-indigo-900 transition-all duration-300"
                      : "text-[#D32F2F] opacity-50 cursor-not-allowed"
                  }
                >
                  <Copy size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Name */}
        <InputField
          label="Name"
          placeholder="Enter name"
          {...register("name")}
          errMsg={errors.name?.message}
          isRequired
        />

        {/* Name mm */}
        <InputField
          label="Name MM"
          placeholder="Enter name MM"
          {...register("name_mm")}
          errMsg={errors.name_mm?.message}
          isRequired
        />

        {/* Description */}
        <InputField
          label="Description"
          placeholder="Enter description"
          {...register("description")}
          errMsg={errors.description?.message}
          isRequired
        />

        {/* Description mm */}
        <InputField
          label="Description MM"
          placeholder="Enter description MM"
          {...register("description_mm")}
          errMsg={errors.description_mm?.message}
          isRequired
        />

        {/* Discount Type */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Discount Type <span className="text-red-500">*</span>
          </label>

          <Controller
            control={control}
            name="discountType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VOUCHER_DISCOUNT_TYPE_ENUM.AMOUNT}>
                    Amount
                  </SelectItem>
                  <SelectItem value={VOUCHER_DISCOUNT_TYPE_ENUM.PERCENTAGE}>
                    Percentage
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.discountType && (
            <p className="text-sm text-red-500 mt-1">
              {errors.discountType.message}
            </p>
          )}
        </div>

        {/* Discount Value */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Discount{" "}
            {watch("discountType") === VOUCHER_DISCOUNT_TYPE_ENUM.PERCENTAGE
              ? "Percentage"
              : "Value"}{" "}
            <span className="text-red-500">*</span>
          </label>

          <InputField
            type="number"
            placeholder={
              watch("discountType") === VOUCHER_DISCOUNT_TYPE_ENUM.PERCENTAGE
                ? "Max 100"
                : "Enter discount value"
            }
            {...register("discountValue", {
              valueAsNumber: true,
            })}
            errMsg={errors.discountValue?.message}
            isRequired
          />
        </div>

        {/* Maximum amount */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Maximum amount (THB){" "}
            {watch("discountType") === VOUCHER_DISCOUNT_TYPE_ENUM.PERCENTAGE ? (
              <span className="text-red-500">*</span>
            ) : (
              <span>(Optional)</span>
            )}
          </label>

          <InputField
            type="number"
            placeholder={"Enter maximum amount"}
            {...register("maximumAmount")}
            errMsg={errors.maximumAmount?.message}
            isRequired
          />
        </div>

        {/* Min purchase */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Minimal purchase (THB) <span className="text-red-500">*</span>
          </label>

          <InputField
            type="number"
            placeholder={"Enter minimal purchase"}
            {...register("minPurchase", {
              valueAsNumber: true,
            })}
            errMsg={errors.minPurchase?.message}
            isRequired
          />
        </div>

        {/* Min quantity */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Minimal quantity <span className="text-red-500">*</span>
          </label>

          <InputField
            type="number"
            placeholder={"Enter minimal quantity"}
            {...register("minQuantity", {
              valueAsNumber: true,
            })}
            errMsg={errors.minQuantity?.message}
            isRequired
          />
        </div>

        {/* Usage limit */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Usage limit <span className="text-red-500">*</span>
          </label>

          <InputField
            type="number"
            placeholder={"Enter usage limit"}
            {...register("usageLimit", {
              valueAsNumber: true,
            })}
            errMsg={errors.usageLimit?.message}
            isRequired
          />
        </div>

        {/* select special day */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Special Day (Optional)
            </label>

            {watch("specialDay") && (
              <button
                type="button"
                onClick={() => setValue("specialDay", undefined)}
                className="text-xs text-red-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <Controller
            control={control}
            name="specialDay"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select special day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VOUCHER_SPECIAL_DAY_ENUM.BIRTHDAY}>
                    Birthday
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Start Date */}
        {!specialDay && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Start Date <span className="text-red-500">*</span>
            </label>

            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left border rounded-md px-3 py-2 text-sm",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpenStartDate(false);
                      }}
                      disabled={(date) => date < startOfDay(new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />

            {errors.startDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>
        )}

        {/* End Date */}
        {!specialDay && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              End Date <span className="text-red-500">*</span>
            </label>

            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!startDate}
                      className={cn(
                        "w-full justify-start text-left border rounded-md px-3 py-2 text-sm",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpenEndDate(false);
                      }}
                      disabled={(date) =>
                        startDate ? date <= startDate : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />

            {errors.endDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        )}

        {/* Code Prefix */}
        {isCodeOnly && (
          <InputField
            label="Code Prefix"
            placeholder="Enter code prefix"
            {...register("codePrefix")}
            errMsg={errors.codePrefix?.message}
            isRequired
          />
        )}

        {/* Add Coupon Code (edit mode only, opt-in) */}
        {isCodeOnly && !!data && !addCodeRequested && (
          <div className="col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setValue("addCodeRequested", true)}
            >
              <Plus size={16} className="mr-2" />
              Add Coupon Code
            </Button>
          </div>
        )}

        {/* New codes batch request */}
        {isCodeOnly && (!data || addCodeRequested) && (
          <>
            <InputField
              label="Code Comment"
              placeholder="Enter code comment"
              {...register("codes.comment")}
              errMsg={errors.codes?.comment?.message}
              isRequired
            />

            <InputField
              type="number"
              label="Code Count"
              placeholder="Enter code count"
              {...register("codes.count", {
                valueAsNumber: true,
              })}
              errMsg={errors.codes?.count?.message}
              isRequired
            />

            {!!data && (
              <div className="col-span-2 flex justify-start">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setValue("addCodeRequested", false);
                    setValue("codes.comment", "");
                    setValue("codes.count", undefined);
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end col-span-2">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Loading..." : data ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VoucherForm;
