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
import { useRef, useEffect, useState } from "react";
import { ImageUpload, ImageUploadRef } from "@/components/ImageUpload";
import { getSignedUrlAndImageDataUpload } from "@/util";
import { Eye, EyeOff } from "lucide-react";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  initialValues?: ResellerT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: any) => void;
};

const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function ResellerForm({
  mode,
  initialValues,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const isEdit = mode === "edit";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<ResellerFormValues>({
    resolver: zodResolver(resellerSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      active: initialValues?.active ?? true,
      credit: {
        currency: "THB",
        balance: initialValues?.credit?.balance ? Number(initialValues.credit.balance) : 0,
        relatedImages: initialValues?.credit?.relatedImages ?? [],
      },
      user: {
        contactNo: initialValues?.contactNo ?? "",
        email: initialValues?.email ?? "",
        username: initialValues?.name ?? "",
        password: "",
        confirmPassword: "",
        countryCode: "+66",
      },
    },
  });

  const relatedImagesRef = useRef<ImageUploadRef>(null);

  // Auto-sync username with name
  useEffect(() => {
    const nameValue = watch("name");
    if (nameValue && !isEdit) {
      setValue("user.username", nameValue, { shouldValidate: true });
    }
  }, [watch("name"), isEdit, setValue]);

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setValue("user.password", newPassword, { shouldValidate: true });
    setValue("user.confirmPassword", newPassword, { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        // Handle deferred image uploads
        let updatedValues = { ...values };
        
        // Upload related images if there's a file to upload
        if (relatedImagesRef.current) {
          const relatedImageFile = relatedImagesRef.current.getFileToUpload();
          if (relatedImageFile) {
            const result = await getSignedUrlAndImageDataUpload(relatedImageFile, "CREDIT_TOP_UP");
            if (result.status === 200 && result.url) {
              updatedValues = { 
                ...updatedValues, 
                credit: {
                  ...updatedValues.credit,
                  relatedImages: [result.url]
                }
              };
            }
          }
        }
        
        const payload =
          mode === "create"
            ? {
                name: updatedValues.name,
                credit: {
                  balance: updatedValues.credit.balance,
                  currency: updatedValues.credit.currency,
                  relatedImages: updatedValues.credit.relatedImages || [],
                },
                user: {
                  contactNo: updatedValues.user.contactNo,
                  email: updatedValues.user.email,
                  username: updatedValues.user.username,
                  password: updatedValues.user.password,
                  active: updatedValues.user.active ?? true,
                  countryCode: updatedValues.user.countryCode,
                },
                active: updatedValues.active,
              }
            : {
                id: initialValues!.id,
                name: updatedValues.name,
                active: updatedValues.active,
                credit: {
                  relatedImages: updatedValues.credit.relatedImages || [],
                },
              };

        onSubmit(payload);
      })}
      className="space-y-6"
    >
      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Reseller Name"
          isRequired 
          disabled={isEdit}
          placeholder="Enter reseller name"
          {...register("name")}
          errMsg={errors.name?.message}
        />

        <div className="space-y-1">
          <label className="text-sm font-medium">
            Currency <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              value="THB"
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">฿</span>
            </div>
          </div>
          {errors.credit?.currency && (
            <p className="text-xs text-red-500">{errors.credit?.currency?.message}</p>
          )}
        </div>
      </div>

      {/* Credit */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          type="number"
          label="Initial Balance"
          placeholder="1000"
          {...register("credit.balance", { valueAsNumber: true })}
          disabled={isEdit}
          errMsg={errors.credit?.balance?.message}
        />

        {isEdit && (
          <ReadOnly
            label="Total Usage"
            value={initialValues?.credit.totalUsage.toLocaleString()}
          />
        )}
      </div>

      {/* User Information */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">User Account Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Email"
            isRequired
            placeholder="user@example.com"
            {...register("user.email")}
            errMsg={errors.user?.email?.message}
          />
          
          <InputField
            label="Contact Number"
            isRequired
            placeholder="+66XXXXXXXXX"
            {...register("user.contactNo")}
            errMsg={errors.user?.contactNo?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              value={watch("user.username") || ""}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
              placeholder="Auto-generated from name"
            />
            {errors.user?.username && (
              <p className="text-xs text-red-500">{errors.user?.username?.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Password {isEdit && "(Leave blank to keep current password)"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={isEdit ? "Enter new password" : "Enter password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("user.password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
            {errors.user?.password && (
              <p className="text-xs text-red-500">{errors.user?.password?.message}</p>
            )}
            {!isEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGeneratePassword}
                className="mt-1"
              >
                Generate Random Password
              </Button>
            )}
          </div>
        </div>

        {!isEdit && (
          <div className="mt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("user.confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.user?.confirmPassword && (
                <p className="text-xs text-red-500">{errors.user?.confirmPassword?.message}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Images */}
      <ImageUpload
        ref={relatedImagesRef}
        label="Related Images"
        disabled={isEdit}
        value={watch("credit.relatedImages")?.[0] || ""}
        onChange={(val) =>
          setValue("credit.relatedImages", val ? [val] : [], {
            shouldValidate: true,
          })
        }
        errMsg={errors.credit?.relatedImages?.message as string}
        folderType="CREDIT_TOP_UP"
      />

      {/* Edit-only info */}
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
            value={new Date(
              initialValues!.credit.updatedAt
            ).toLocaleString()}
          />
        </div>
      )}

      {/* Active Status */}
      <div className="flex items-center justify-between rounded-lg border px-4 py-3">
        <div>
          <p className="font-medium">Active Status <span className="text-red-500 text-sm">*</span></p>
          <p className="text-xs text-gray-500">
            {isEdit 
              ? "Control reseller account access" 
              : "Account will be active by default"}
          </p>
        </div>
        <Switch
          checked={watch("active")}
          onCheckedChange={(val) => setValue("active", val)}
          disabled={!isEdit}
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
