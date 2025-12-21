import React from "react";
import { Bell, ShoppingBag } from "lucide-react";

const Header: React.FC= () => {
  return (
    <header className="flex absolute top-0 left-0 justify-end items-start w-full  p-3">
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors relative">
          <ShoppingBag size={20} />
        </button>
        <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <img
            src="https://picsum.photos/id/64/100/100"
            alt="User"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">John Carter</p>
            <p className="text-xs text-gray-500">Account settings</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
