import { UserProvider } from "@/provider/UserProvider";
import useAuthStore from "@/store/useAuthStore";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
};

export default ProtectedRoute;
