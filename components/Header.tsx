import React from "react";
import { Bell, ShoppingBag, ChevronRight } from "lucide-react";
import { useUser } from "@/provider/UserProvider";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useSidebarStore } from "@/store/useSidebarStore";

const Header: React.FC = () => {
  const { user } = useUser();
  const { items, addToCartCount } = useCartStore();
  const { creditInfo } = useWalletStore();
  const { isCollapsed } = useSidebarStore();
  const navigate = useNavigate();

  return (
    <header 
      className={`fixed top-0 right-0 z-40 h-15 transition-all duration-300 ease-in-out bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm flex gap-2 items-center justify-end px-6
        ${isCollapsed ? 'left-[80px]' : 'left-[232px]'}`}
    >
      {/* Left Section: Balance Widget */}
      <div className="flex items-center gap-4">
        <div className="p-1  transition-all duration-300 cursor-default group">
            
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Balance</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-gray-800">{creditInfo.currency}</span>
                <span className="text-xs font-extrabold text-black bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {creditInfo?.balance?.toLocaleString("en-US") || "0"}
                </span>
              </div>
            </div>
          </div>
        </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2">
        {/* Action Buttons Group */}
        <div className="flex items-center bg-gray-100/50 rounded-full p-1 mr-2">
          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2.5 rounded-full hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600 group"
            aria-label="Cart"
          >
            <ShoppingBag size={20} className="group-hover:text-indigo-600 transition-colors" />
            {addToCartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 flex items-center justify-center bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-sm ring-2 ring-white">
                {addToCartCount}
              </span>
            )}
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Notifications */}
          <button className="relative p-2.5 rounded-full hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600 group" aria-label="Notifications">
            <Bell size={20} className="group-hover:text-indigo-600 transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f3f4f6]"></span>
          </button>
        </div>

        {/* User Profile */}
        <div
          onClick={() => navigate("/settings/general")}
          className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group pr-2 py-1  hover:bg-gray-50 transition-colors"
        >
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
              {user?.username || "User"}
            </p>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{user?.type}</p>
          </div>
          <div className="relative">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md">
              <img
                src="https://img.freepik.com/premium-vector/avatar-profil-picture-icon-vector-design-template_393879-5783.jpg?semt=ais_hybrid&w=740&q=80"
                alt="User"
                className="w-9 h-9 rounded-full object-cover border-2 border-white"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </header>
  );
};

export default Header;