import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Server, WifiOff } from "lucide-react";
import { removeErrorStatus } from "@/util/errorHandler";


const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorType = location.state?.errorType || "server"; // 'network' or 'server'
  const errorMessage = location.state?.message || "Something went wrong";

  const getTitle = () => {
    return errorType === "network" 
      ? "Connection Lost" 
      : "Internal Server Error";
  };

  const getSubtitle = () => {
    return errorType === "network"
      ? "Failed to fetch data from the server"
      : "An unexpected error occurred on the server";
  };

  const getIcon = () => {
    return errorType === "network" ? WifiOff : Server;
  };

  const handleRetry = () => {
    // Remove error status from localStorage
    removeErrorStatus();
    window.location.assign("/");   
    // Navigate back to previous page or dashboard
    // if (location.state?.from) {
    //   navigate(location.state.from, { replace: true });
    // } else {
    //   navigate("/", { replace: true });
    // }
  };

  const IconComponent = getIcon();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <IconComponent className="w-10 h-10 text-red-500" />
          </div>

          {/* Error Type Indicator */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {errorType === "network" ? "Network Error" : "Server Error"}
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getTitle()}
          </h1>
          <p className="text-gray-600 mb-8">
            {getSubtitle()}
            {errorMessage ? (
              <span className="block mt-2 text-sm bg-gray-100 rounded-lg p-3 text-left">
                {errorMessage}
              </span>
            ) : (
              <span className="block mt-2 text-sm">Please try again</span>
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* <Button 
              onClick={handleRetry}
              className="w-full sm:w-auto px-6"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button> */}
            <Button
              onClick={() => navigate("/", { replace: true })}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Info Message */}
        <p className="mt-6 text-sm text-gray-500">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;