"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormValues, userSchema } from "@/types/schema/userSchema";
import InputField from "@/components/InputField";
import { PhoneInput } from "@/components/PhoneInput";
import { getErrMsg } from "@/util/initData";
import { useUserRoles } from "@/hooks/useUserRoles";
import { toast } from "sonner";
import { Fragment } from "react/jsx-runtime";
import { getResellers } from "@/graphql/reseller";
import { ResellerT } from "@/types/reseller.type";
import { useEffect, useState } from "react";
import { useUser } from "@/provider/UserProvider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LockKeyhole } from "lucide-react";

type UserFormProps = {
  loading: boolean;
  initialValues?: Partial<UserFormValues>;
  mode: "create" | "edit";
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
};

const STATUS_STYLE: Record<"true" | "false", string> = {
  true: "bg-green-50 text-green-700",
  false: "bg-red-50 text-red-700",
};

export default function UserForm({
  loading,
  initialValues,
  mode,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const { user } = useUser();
  const userType = user.type as "OWNER" | "RESELLER";
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: initialValues?.username || "",
      email: initialValues?.email || "",
      active: initialValues?.active ?? true,
      contactNo: initialValues?.contactNo || "",
      countryCode: initialValues?.countryCode || "95",
      roleIds: initialValues?.roleIds || [],
      password: mode === "edit" ? "defaultPassword" : "",
      resellerId: initialValues?.resellerId || "",
      confirmPassword: mode === "edit" ? "defaultPassword" : "",
    },
  });

  const { data: USER_ROLES } = useUserRoles({
    limit: 10,
    page: 1,
    orderBy: { dir: "desc" },
    resellerId: null,
  });

  useEffect(() => {
    if (user.type === "OWNER") {
      fetchResellers();
    }
  }, []);

  const [resellerData, setResellerData] = useState<ResellerT[]>([]);

  const roleIds = watch("roleIds") || [];

  const fetchResellers = async () => {
    try {
      const res: any = await getResellers({
        active: true,
        limit: 50,
        page: 1,
        orderBy: { 
          dir: "desc", 
          // field: "name" 
        },
        search:""
      });
      setResellerData(res?.data?.findAllResellers?.data || []);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }
  };

  const submitHandler = async (values: UserFormValues) => {
    try {
      // Additional validation for OWNER user type
      if (userType === "OWNER" && !values.resellerId) {
        setError("resellerId", {
          type: "manual",
          message: "Reseller is required for OWNER accounts",
        });
        return;
      }
      await onSubmit(values);
      reset();
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }
  };

  const toggleRoleSelection = (roleId: string) => {
    if (mode === "edit") return;
    const isSelected = roleIds.includes(roleId);
    let newRoleIds: string[];

    if (isSelected) {
      newRoleIds = roleIds.filter((id) => id !== roleId);
    } else {
      newRoleIds = [...roleIds, roleId];
    }
    setValue("roleIds", newRoleIds, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      {errors.root && (
        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md">
          {errors.root.message}
        </div>
      )}
      <InputField
        label="User Name"
        id="userName"
        isRequired
        placeholder="Enter user name!"
        {...register("username")}
        disabled={mode === "edit"}
        errMsg={errors?.username?.message}
      />

      <InputField
        label="Email"
        id="email"
        isRequired
        placeholder="Enter email!"
        {...register("email")}
        disabled={mode === "edit"}
        errMsg={errors?.email?.message}
      />
      {/* Reseller Selection - Only for OWNER user type */}
      {userType === "OWNER" && (
        <div className="flex gap-2 flex-col">
          <label className="flex items-center gap-1 text-sm font-medium">
            Reseller{" "}
            {mode === "edit" ? (
              <LockKeyhole size={12} className="mb-[1px]" />
            ) : (
              <span className="text-red-500">*</span>
            )}
          </label>
          <select
            value={getValues("resellerId") || ""}
            {...register("resellerId", {
              required: "Reseller is required for OWNER accounts",
            })}
            disabled={mode === "edit"}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value={""}>Select a reseller</option>
            {resellerData.map((reseller) => (
              <option key={reseller.id} value={reseller.id}>
                {reseller.name}
              </option>
            ))}
          </select>
          {errors?.resellerId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.resellerId.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="text-sm flex items-center gap-2 font-medium text-gray-700 mb-2">
          User Roles{" "}
          {mode === "edit" ? (
            <LockKeyhole size={12} className="mb-[1px]" />
          ) : (
            <span className="text-red-500">*</span>
          )}
        </label>

        <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
          {USER_ROLES && USER_ROLES.length > 0 ? (
            USER_ROLES.map((role) => {
              const isSelected = roleIds.includes(role.id);
              return (
                <div
                  key={role.id}
                  onClick={() => toggleRoleSelection(role.id)}
                  className={`
                    flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200 border
                    ${
                      isSelected
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-white border-transparent hover:bg-gray-100"
                    }
                  `}
                >
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-blue-900" : "text-gray-700"
                    }`}
                  >
                    {role.name}
                  </span>

                  {/* Radio-like Visual Indicator */}
                  <div
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${isSelected ? "border-blue-600" : "border-gray-300"}
                    `}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-in zoom-in duration-200" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No roles available
            </div>
          )}
        </div>

        {/* Validation Error Message */}
        {errors?.roleIds && (
          <p className="text-red-500 text-xs mt-1">{errors.roleIds.message}</p>
        )}
      </div>

      <PhoneInput
        id="contactNo"
        label="Phone Number"
        isRequired
        isDisabled
        disabled={mode === "edit"}
        countryCallingCodeEditable={false}
        className="items-center border border-gray-300 rounded-lg mt-1.5 bg-white"
        defaultCountry="MM"
        international={true}
        onCountryChange={(country) => {
          setValue("countryCode", country || "95");
        }}
        onChange={(value) => {
          setValue("contactNo", value);
        }}
        value={initialValues?.contactNo || ""}
        errMsg={errors?.contactNo?.message}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Status <span className="text-red-500">*</span>
        </label>

        <div className="flex gap-2">
          <Select
            value={String(watch("active"))}
            onValueChange={(value) =>
              setValue("active", value === "true", {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                STATUS_STYLE[String(watch("active")) as "true" | "false"]
              }`}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="true"
                  className="text-green-700 focus:bg-green-50"
                >
                  🟢 Active
                </SelectItem>

                <SelectItem
                  value="false"
                  className="text-red-700 focus:bg-red-50"
                >
                  🔴 Inactive
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {errors.active && (
          <p className="mt-1 text-sm text-red-500">{errors.active.message}</p>
        )}
      </div>

      {mode === "create" && (
        <Fragment>
          <InputField
            label="Password"
            id="password"
            isRequired
            placeholder="Enter password!"
            {...register("password")}
            errMsg={errors?.password?.message}
          />

          <InputField
            label="Confirm Password"
            id="confirmPassword"
            isRequired
            placeholder="Enter confirm password!"
            {...register("confirmPassword")}
            errMsg={errors?.confirmPassword?.message}
          />
        </Fragment>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting || loading
            ? "Saving..."
            : mode === "create"
            ? "Create"
            : "Save"}
        </button>
      </div>
    </form>
  );
}
