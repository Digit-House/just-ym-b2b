import React from "react";
import { Bell, ShoppingBag } from "lucide-react";
import { useUser } from "@/provider/UserProvider";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";

const Header: React.FC = () => {
  const { user } = useUser();
  const { items } = useCartStore();
  const naviage = useNavigate();
  return (
    <header className="flex absolute top-0 left-0 justify-end items-start w-full  p-3">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            naviage("/cart");
          }}
          className="p-2 text-gray-500 hover:text-indigo-600 transition-colors relative"
        >
          <ShoppingBag size={20} />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {items.length}
            </span>
          )}
        </button>
        <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div
          onClick={() => {
            naviage("/settings/general");
          }}
          className="flex cursor-pointer items-center gap-3 pl-4 border-l border-gray-200"
        >
          <img
            src="https://img.freepik.com/premium-vector/avatar-profil-picture-icon-vector-design-template_393879-5783.jpg?semt=ais_hybrid&w=740&q=80"
            alt="User"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500">Account settings</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
