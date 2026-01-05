import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/useAuthStore";
import { LoginFormValues, loginSchema } from "@/types/schema/authSchema";
import { login } from "@/graphql/auth";
import { getErrMsg } from "@/util/initData";

const Login = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
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
      if (res.data.login.accessToken) {
        setToken(res.data.login.accessToken);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setErrMsg(getErrMsg(err, "message"));
      setTimeout(() => {
        setErrMsg("");
      }, 5000);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50">
      {/* 1. Full Background Image */}
      {/* Using a high-quality beach image similar to your description */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:"url('/img/background.jpg')",
        }}
      >
        {/* Dark Overlay to make the form readable */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* 2. Absolute Centered Form Card */}
      <div className="fixed bottom-[100px] right-50 z-10 w-full max-w-md  px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              LET'S GET YOU STARTED
            </h1>
            <p className="text-sm text-gray-500">Login to Your Account</p>
          </div>

          {/* API Error Message */}
          {errMsg && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-center text-sm font-medium text-red-600">
                {errMsg}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="johnlee@example.com"
                className={`w-full rounded-lg border px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20 ${
                  errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-purple-600"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20 ${
                  errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-purple-600"
                }`}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:bg-purple-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")} // Assuming you have a signup route
              className="font-semibold text-purple-600 hover:text-purple-500 hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;