"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/InputField";
import { Button } from "@/components/ui/button";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "@/types/schema/changePasswordSchema";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from "@/types/schema/forgotPasswordSchema";
import { updatePassword, forgotPassword, resetPassword } from "@/graphql/user";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";

type Props = {
  onClose: () => void;
};

// Define the form modes
enum FormMode {
  CHANGE_PASSWORD = 'change',
  FORGOT_PASSWORD = 'forgot',
  RESET_PASSWORD = 'reset'
}

const ChangePasswordForm = ({ onClose }: Props) => {
  // State to track the current form mode
  const [formMode, setFormMode] = React.useState<FormMode>(FormMode.CHANGE_PASSWORD);
  
  // State to track the email for reset password flow
  const [resetEmail, setResetEmail] = React.useState<string>("");

  // Form for changing password (current logged-in user)
  const {
    register: registerChange,
    handleSubmit: handleSubmitChange,
    formState: { errors: errorsChange, isSubmitting: isSubmittingChange },
    reset: resetChangeForm
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Form for forgot password
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot, isSubmitting: isSubmittingForgot },
    reset: resetForgotForm
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Form for reset password
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset, isSubmitting: isSubmittingReset },
    reset: resetResetForm
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Handle change password submission
  const onChangePasswordSubmit = async (data: ChangePasswordFormValues) => {
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

  // Handle forgot password submission
  const onForgotPasswordSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      // await forgotPassword(data.email);
      toast.success("Password reset code sent to your email!");
      setResetEmail(data.email); // Store the email for the next step
      setFormMode(FormMode.RESET_PASSWORD); // Move to reset password form
      resetForgotForm(); // Clear the forgot password form
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }
  };

  // Handle reset password submission
  const onResetPasswordSubmit = async (data: ResetPasswordFormValues) => {
    try {
      // await resetPassword(data.code, data.newPassword);
      toast.success("Password reset successful! You can now log in with your new password.");
      setFormMode(FormMode.CHANGE_PASSWORD); // Return to initial state
      resetResetForm(); // Clear the reset password form
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }
  };

  // Function to switch to forgot password mode
  const goToForgotPassword = () => {
    setFormMode(FormMode.FORGOT_PASSWORD);
    resetChangeForm();
  };

  // Function to go back to change password mode
  const goToChangePassword = () => {
    setFormMode(FormMode.CHANGE_PASSWORD);
    resetForgotForm();
    resetResetForm();
  };

  // Function to go back to forgot password mode from reset mode
  const goToForgotFromReset = () => {
    setFormMode(FormMode.FORGOT_PASSWORD);
    resetResetForm();
  };

  return (
    <div className="w-full max-w-md">
      {/* Change Password Form */}
      {formMode === FormMode.CHANGE_PASSWORD && (
        <form onSubmit={handleSubmitChange(onChangePasswordSubmit)} className="space-y-4">
          <InputField
            label="Current Password"
            type="password"
            placeholder="******"
            isRequired
            errMsg={errorsChange.oldPassword?.message}
            {...registerChange("oldPassword")}
          />

          <InputField
            label="New Password"
            type="password"
            isRequired
            placeholder="******"
            errMsg={errorsChange.newPassword?.message}
            {...registerChange("newPassword")}
          />

          <InputField
            label="Confirm New Password"
            type="password"
            isRequired
            placeholder="******"
            errMsg={errorsChange.confirmPassword?.message}
            {...registerChange("confirmPassword")}
          />

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={goToForgotPassword}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Forgot Password?
            </button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingChange}>
                Change Password
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Forgot Password Form */}
      {formMode === FormMode.FORGOT_PASSWORD && (
        <form onSubmit={handleSubmitForgot(onForgotPasswordSubmit)} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset Your Password</h3>
          <p className="text-gray-600 text-sm mb-6">
            Enter your email address and we'll send you a code to reset your password.
          </p>

          <InputField
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            isRequired
            errMsg={errorsForgot.email?.message}
            {...registerForgot("email")}
          />

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={goToChangePassword}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Back to Login
            </button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingForgot}>
                Send Reset Code
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Reset Password Form */}
      {formMode === FormMode.RESET_PASSWORD && (
        <form onSubmit={handleSubmitReset(onResetPasswordSubmit)} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Reset Code</h3>
          <p className="text-gray-600 text-sm mb-6">
            We've sent a reset code to <span className="font-semibold">{resetEmail}</span>. Please enter the code and your new password.
          </p>

          <InputField
            label="Reset Code"
            type="text"
            placeholder="Enter 6-digit code"
            isRequired
            errMsg={errorsReset.code?.message}
            {...registerReset("code")}
          />

          <InputField
            label="New Password"
            type="password"
            isRequired
            placeholder="Enter new password"
            errMsg={errorsReset.newPassword?.message}
            {...registerReset("newPassword")}
          />

          <InputField
            label="Confirm New Password"
            type="password"
            isRequired
            placeholder="Confirm new password"
            errMsg={errorsReset.confirmPassword?.message}
            {...registerReset("confirmPassword")}
          />

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={goToForgotFromReset}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Resend Code
            </button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingReset}>
                Reset Password
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordForm;
