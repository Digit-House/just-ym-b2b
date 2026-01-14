import React from "react";
import { Bell, ShoppingBag } from "lucide-react";
import { useUser } from "@/provider/UserProvider";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useWalletStore } from "@/store/useWalletStore";

const Header: React.FC = () => {
  const { user } = useUser();
  const { items, addToCartCount } = useCartStore();
  const { creditInfo } = useWalletStore();
  const naviage = useNavigate();
  return (
    <header className="flex absolute bg-white top-0 right-0 justify-between items-center w-full max-w-[calc(100vw-232px)]  p-3 shadow-[0px_8px_12px_0px_#0000000D]">
      <div>
        <p className="text-xl font-bold">
          <span className="text-gray-900">Your Balance : </span>
          <span className="text-indigo-600">
            {creditInfo.currency} {creditInfo?.balance}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            naviage("/cart");
          }}
          className="p-2 text-gray-500 hover:text-indigo-600 transition-colors relative"
        >
          <ShoppingBag size={20} />
          {addToCartCount > 0 && (
            <span className="absolute top-1 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {addToCartCount}
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
