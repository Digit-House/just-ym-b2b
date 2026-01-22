import React from "react";
import { ChevronRight, ShoppingBag, Wallet } from "lucide-react";
import { useUser } from "@/provider/UserProvider";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useSidebarStore } from "@/store/useSidebarStore";

const Header: React.FC = () => {
  const { user } = useUser();
  const { addToCartCount } = useCartStore();
  const { creditInfo } = useWalletStore();
  const { isCollapsed } = useSidebarStore();
  const navigate = useNavigate();

  return (
    <header
      className={`flex fixed z-30 bg-white top-0 right-0 justify-between items-center w-full  py-2 px-10 shadow-[0px_8px_12px_0px_#0000000D] transition-all duration-300 ${
        isCollapsed ? "max-w-[calc(100vw-80px)]" : "max-w-[calc(100vw-232px)]"
      }`}
    >
      {/* UPDATED WALLET UI */}
      <div className="p-2 rounded-[8px] flex items-center gap-4 bg-indigo-700 text-white shadow-md shadow-indigo-700/20">
        {/* Main Balance Section */}
        <div className="flex items-center gap-3 pr-4 border-r border-indigo-500/50">
          <div className="p-1.5 bg-white/10 rounded-md">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-indigo-200 uppercase tracking-wider">
              Available Credits
            </p>
            <p className="text-sm font-bold leading-tight">
              {creditInfo?.currency}{" "}
              {creditInfo?.balance?.toLocaleString("en-US") || "0"}
            </p>
          </div>
        </div>

        {/* Owner Specific Section */}
        {user.type == "OWNER" && (
          <div className="flex items-center gap-5">
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-medium text-indigo-200 uppercase">
                GT Bal
              </span>
              <span className="text-xs font-bold">
                THB {creditInfo?.gtBalance?.toLocaleString("en-US") || "0"}
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-medium text-indigo-200 uppercase">
                GT Main
              </span>
              <span className="text-xs font-bold">
                THB {creditInfo?.gtBalanceMain?.toLocaleString("en-US") || "0"}
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-medium text-indigo-200 uppercase">
                Cust Bal
              </span>
              <span className="text-xs font-bold">
                THB{" "}
                {creditInfo?.customerBalance?.toLocaleString("en-US") || "0"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {user.type !== "OWNER" && (
          <div className="flex items-center bg-gray-100/50 rounded-full p-1 mr-2">
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2.5 rounded-full hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600 group"
              aria-label="Cart"
            >
              <ShoppingBag
                size={20}
                className="group-hover:text-indigo-600 transition-colors"
              />
              {addToCartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 flex items-center justify-center bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-sm ring-2 ring-white">
                  {addToCartCount}
                </span>
              )}
            </button>
          </div>
        )}
        <div
          onClick={() => navigate("/settings/general")}
          className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group pr-2 py-1  hover:bg-gray-50 transition-colors"
        >
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
              {user?.username || "User"}
            </p>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              {user?.type}
            </p>
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
          <ChevronRight
            size={14}
            className="text-gray-400 group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
