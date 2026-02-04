import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/useAuthStore";
import { LoginFormValues, loginSchema } from "@/types/schema/authSchema";
import { login } from "@/graphql/auth";
import { getErrMsg } from "@/util/initData";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import TwoFactorLogin from "@/components/TwoFactorLogin";

const Login = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res: any = await login(data.email, data.password);
      if (res.data.login.requiresTwoFactor) {
        // Store the twoFactorToken for 2FA verification
        setTwoFactorToken(res.data.login.twoFactorToken);
        setRequiresTwoFactor(true);
        setErrMsg(""); // Clear any previous errors
        return;
      }
      
      if (res.data.login.accessToken) {
        // Regular login without 2FA
        setToken(res.data.login.accessToken);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setErrMsg(getErrMsg(err, "message"));
      setTimeout(() => setErrMsg(""), 5000);
    }
  };

  const handleBackToLogin = () => {
    setRequiresTwoFactor(false);
    setTwoFactorToken("");
    setErrMsg("");
  };

  // Show 2FA verification if required
  if (requiresTwoFactor) {
    return (
      <TwoFactorLogin 
        twoFactorToken={twoFactorToken} 
        onBack={handleBackToLogin} 
      />
    );
  }

  // Show regular login form
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Form */}
      <div className="fixed bottom-50 right-50 z-10 w-full max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              LET'S GET YOU STARTED
            </h1>
            <p className="text-sm text-gray-500">Login to Your Account</p>
          </div>

          {/* API Error */}
          {errMsg && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-center text-sm font-medium text-red-600">
                {errMsg}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <InputField
              label="Email"
              type="email"
              placeholder="johnlee@example.com"
              errMsg={errors.email?.message}
              isRequired
              {...register("email")}
            />

            {/* Password (eye toggle auto works) */}
            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              errMsg={errors.password?.message}
              isRequired
              {...register("password")}
            />

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full!"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
