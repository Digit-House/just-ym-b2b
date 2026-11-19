import useAuthStore from "@/store/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { NAV_CONFIG } from "@/types/navitem.type";
import { useUser } from "@/provider/UserProvider";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

const ProtectedRoute = () => {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <RouteGuard />;
};

const EDITOR_PATH = /^\/(content-tickets(\/[^/]+)?|settings\/general)\/?$/;

// RouteGuard component that handles role-based access control
const RouteGuard = () => {
  const location = useLocation();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(false);
  }, [user]);

  // Content editors may only open the content ticket pages and general settings.
  if (user?.type === "CONTENT_EDITOR" && !EDITOR_PATH.test(location.pathname)) {
    return <Navigate to="/content-tickets" replace />;
  }
  if (user && user.type !== "CONTENT_EDITOR" && location.pathname.startsWith("/content-tickets")) {
    return <Navigate to="/" replace />;
  }

  if(user && user?.type !== "OWNER" && location.pathname.includes("admin-tickets")){
    return <Navigate to="/" replace />; 
  }

  // Check if the current path is allowed for the user's role
  if (user && location.pathname) {
    // Find the matching route in NAV_CONFIG
    const matchedRoute = findRouteByPath(NAV_CONFIG, location.pathname);
    
    if (matchedRoute && matchedRoute.types !== "ALL") {
      const allowedTypes = matchedRoute.types as string[];
      
      if (!allowedTypes.includes(user.type)) {
        // Redirect to dashboard if user doesn't have access to this route
        return <Navigate to="/" replace />;
      }
    }
  }

  if(loading){
    return <Loading />;
  }

  return <Outlet />;
};

// Helper function to find a route by path in the NAV_CONFIG
const findRouteByPath = (navItems: any[], path: string) => {
  for (const item of navItems) {
    if (item.path === path) {
      return item;
    }
    
    if (item.children) {
      const childMatch = findRouteByPath(item.children, path);
      if (childMatch) {
        return childMatch;
      }
    }
  }
  
  return null;
};

export default ProtectedRoute;
