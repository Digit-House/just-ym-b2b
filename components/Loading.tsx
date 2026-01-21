import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <img 
            src="/img/logo.png" 
            alt="JustM Logo" 
            className="w-24 h-24 object-contain animate-pulse"
          />
          {/* <div className="absolute inset-0 w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div> */}
        </div>
        <div className="text-2xl font-bold text-gray-800 mb-2">JustM</div>
        <div className="text-gray-600">Loading your dashboard...</div>
        <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;