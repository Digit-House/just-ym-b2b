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

type UserFormProps = {
  loading: boolean;
  initialValues?: Partial<UserFormValues>;
  mode: "create" | "edit";
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
};

export default function UserForm({
  loading,
  initialValues,
  mode,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      confirmPassword: mode === "edit" ? "defaultPassword" : "",
    },
  });

  const { data: USER_ROLES } = useUserRoles({
    limit: 10,
    page: 1,
    orderBy: { dir: "desc" },
    resellerId: null,
  });

  const roleIds = watch("roleIds") || [];

  const submitHandler = async (values: UserFormValues) => {
    try {
      await onSubmit(values);
      reset();
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }
  };

  // Helper function to toggle role selection
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

      {/* User Roles Select (Updated to Multi-Select List) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          User Roles <span className="text-red-500">*</span>
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

      {mode === "edit" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Active Status
          </label>
          <select
            {...register("active", { setValueAs: (v) => v === "true" })}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          {errors?.active && (
            <p className="text-red-500 text-xs mt-1">{errors.active.message}</p>
          )}
        </div>
      )}

      <PhoneInput
        id="contactNo"
        label="Phone Number"
        isRequired
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
