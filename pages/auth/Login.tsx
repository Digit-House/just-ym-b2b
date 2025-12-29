import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/useAuthStore";
import { LoginFormValues, loginSchema } from "@/types/schema/authSchema";
import { login } from "@/graphql/auth";
import { getErrMsg } from "@/util/initData";

const Login = () => {
  const navigate = useNavigate();
  const [errMsg,setErrMsg] = useState();
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
      const res:any = await login(data.email, data.password);
      if(res.data.login.accessToken) {
        setToken(res.data.login.accessToken);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setErrMsg(getErrMsg(err,"message"));
      setTimeout(() => {
        setErrMsg("");
      },5000)
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="********"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
          {errMsg && (
            <p className="text-sm text-red-500 mt-1">{errMsg}</p>
          )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
