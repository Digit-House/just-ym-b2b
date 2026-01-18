"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/InputField";
import { Button } from "@/components/ui/button";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "@/types/schema/changePasswordSchema";
import { updatePassword } from "@/graphql/user";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";

type Props = {
  onClose: () => void;
};

const ChangePasswordForm = ({ onClose }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      const res = await updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Successfully Updated !");
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Current Password"
        type="password"
        placeholder="******"
        isRequired
        errMsg={errors.oldPassword?.message}
        {...register("oldPassword")}
      />

      <InputField
        label="New Password"
        type="password"
        isRequired
        placeholder="******"
        errMsg={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <InputField
        label="Confirm New Password"
        type="password"
        isRequired
        placeholder="******"
        errMsg={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Change Password
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
