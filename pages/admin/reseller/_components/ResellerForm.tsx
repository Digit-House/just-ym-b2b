"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReadOnly from "@/components/ReadOnly";
import { ResellerT } from "@/types/reseller.type";
import {
  ResellerFormValues,
  resellerSchema,
} from "@/types/schema/resellerSchema";
import InputField from "@/components/InputField";
import { PhoneInput } from "@/components/PhoneInput";
import { useRef, useEffect, useState } from "react";
import { ImageUpload, ImageUploadRef } from "@/components/ImageUpload";
import { getSignedUrlAndImageDataUpload } from "@/util";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  initialValues?: ResellerT;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: any) => void;
};

const generateRandomPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < 8; i++) { // Slightly longer password for security
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
  } = useForm<ResellerFormValues>({
    resolver: zodResolver(resellerSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      active: initialValues?.active ?? true,
      credit: {
        currency: "THB",
        balance: initialValues?.credit?.balance
          ? Number(initialValues.credit.balance)
          : 0,
        relatedImages: initialValues?.credit?.relatedImages ?? [],
      },
      user: {
        contactNo: initialValues?.contactNo ?? "",
        email: initialValues?.email ?? "",
        username: initialValues?.name ?? "",
        password: "",
        confirmPassword: "",
        countryCode: "95",
        active: true,
      },
    },
  });

  const relatedImagesRef = useRef<ImageUploadRef>(null);

  // Auto-sync username with name on Create mode
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

  const preparePayload = async (values: ResellerFormValues) => {
    let updatedValues = { ...values };

    // Handle Image Upload
    if (relatedImagesRef.current) {
      const relatedImageFile = relatedImagesRef.current.getFileToUpload();
      if (relatedImageFile) {
        const result = await getSignedUrlAndImageDataUpload(
          relatedImageFile,
          "CREDIT_TOP_UP"
        );
        if (result.status === 200 && result.url) {
          updatedValues = {
            ...updatedValues,
            credit: {
              ...updatedValues.credit,
              relatedImages: [result.url],
            },
          };
        }
      }
    }

    // Construct Payload based on Mode
    if (mode === "create") {
      return {
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
      };
    } else {
      return {
        id: initialValues!.id,
        name: updatedValues.name,
        active: updatedValues.active,
        credit: {
          relatedImages: updatedValues.credit.relatedImages || [],
        },
      };
    }
  };

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        const payload = await preparePayload(values);
        onSubmit(payload);
      })}
      className="space-y-6"
    >
      <div className="grid grid-cols-1  gap-6">
        
        {/* --- LEFT COLUMN: Profile & Account --- */}
        <div className="space-y-6">
          
          {/* Reseller Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-gray-700">
                Reseller Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField
                label="Reseller Name"
                isRequired
                disabled={isEdit}
                placeholder="e.g. Alpha Retailer"
                {...register("name")}
                errMsg={errors.name?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <InputField
                    label="Email"
                    isRequired
                    placeholder="user@example.com"
                    {...register("user.email")}
                    disabled={isEdit}
                    errMsg={errors.user?.email?.message}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={watch("user.username") || ""}
                      disabled={isEdit}
                      className={`w-full px-3 py-2 text-sm rounded-md border ${
                        isEdit
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                          : "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
                      }`}
                      placeholder="Auto-generated from name"
                    />
                    {errors.user?.username && (
                      <p className="text-xs text-red-500">
                        {errors.user?.username?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <PhoneInput
                id="contactNo"
                label="Contact Number"
                isRequired
                isDisabled={isEdit}
                disabled={isEdit}
                className="border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
                defaultCountry="MM"
                international={true}
                onCountryChange={(countryCode) => {
                  setValue("user.countryCode", countryCode || "95");
                }}
                onChange={(value) => {
                  setValue("user.contactNo", value);
                }}
                value={watch("user.contactNo") || ""}
                errMsg={errors.user?.contactNo?.message}
              />
            </CardContent>
          </Card>

          {/* Account Credentials Card */}
          {!isEdit && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium text-gray-700">
                    Account Security
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePassword}
                    className="h-8 text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Generate Password
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      {...register("user.password")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.user?.password && (
                    <p className="text-xs text-red-500">
                      {errors.user?.password?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      {...register("user.confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.user?.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {errors.user?.confirmPassword?.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* --- RIGHT COLUMN: Financial & Stats --- */}
        <div className="space-y-6">
          
          {/* Financial Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-gray-700">
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      value="THB"
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400 text-xs font-bold">฿</span>
                    </div>
                  </div>
                </div>

                <InputField
                  type="number"
                  label="Initial Balance"
                  placeholder="0.00"
                  {...register("credit.balance", { valueAsNumber: true })}
                  disabled={true} // Disabled as per original logic
                  errMsg={errors.credit?.balance?.message}
                />
              </div>

              <Separator />

              {/* Edit Mode Stats */}
              {isEdit && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <ReadOnly
                    label="Total Usage"
                    value={initialValues?.credit.totalUsage.toLocaleString()}
                  />
                  <ReadOnly
                    label="Total Top-up"
                    value={initialValues?.credit.totalTopUp.toLocaleString()}
                  />
                  <ReadOnly
                    label="Outstanding Debt"
                    value={initialValues?.credit.hasOutstandingDebt ? "Yes" : "No"}
                    valueClassName={initialValues?.credit.hasOutstandingDebt ? "text-red-600 font-medium" : ""}
                  />
                  <ReadOnly
                    label="Last Updated"
                    value={new Date(initialValues!.credit.updatedAt).toLocaleString()}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidence & Settings Card */}
          <div className="space-y-6">
            <ImageUpload
              ref={relatedImagesRef}
              label="Proof / Related Images"
              disabled={false} // Original was true, assuming it should be uploadable
              value={watch("credit.relatedImages")?.[0] || ""}
              onChange={(val) =>
                setValue("credit.relatedImages", val ? [val] : [], {
                  shouldValidate: true,
                })
              }
              errMsg={errors.credit?.relatedImages?.message as string}
              folderType="CREDIT_TOP_UP"
            />

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-gray-900">
                  Active Status
                </p>
                <p className="text-xs text-gray-500">
                  {isEdit
                    ? "Disable to revoke reseller access"
                    : "Account will be active immediately upon creation"}
                </p>
              </div>
              <Switch
                checked={watch("active")}
                onCheckedChange={(val) => setValue("active", val)}
                disabled={!isEdit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="min-w-[140px]">
          {mode === "create" ? "Create Reseller" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}