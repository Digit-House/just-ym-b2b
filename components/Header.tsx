import React from "react";
import { ChevronRight, Menu, ShoppingBag, Wallet, X } from "lucide-react";
import { useUser } from "@/provider/UserProvider";
import { useCartStore } from "@/store/useCartStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useNavigate } from "react-router-dom";

// ── Sub-components ──────────────────────────────────────────────

const BalanceItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) => (
  <div className="flex flex-col justify-center">
    <span className="text-[10px] font-medium text-indigo-200 uppercase">
      {label}
    </span>
    <span className="text-xs font-bold">
      THB {Number(value)?.toLocaleString("en-US") || "0"}
    </span>
  </div>
);

const OwnerBalances = ({
  creditInfo,
  cardStyle = false,
}: {
  creditInfo: any;
  cardStyle?: boolean;
}) => {
  if (cardStyle) {
    return (
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "GT Bal", value: creditInfo?.gtBalance },
          { label: "GT Main", value: creditInfo?.gtBalanceMain },
          { label: "Cust Bal", value: creditInfo?.customerBalance },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col justify-center bg-indigo-800/50 p-2 rounded-lg"
          >
            <span className="text-[10px] font-medium text-indigo-200 uppercase">
              {label}
            </span>
            <span className="text-xs font-bold text-white">
              THB {Number(value)?.toLocaleString("en-US") || "0"}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      {[
        { label: "GT Bal", value: creditInfo?.gtBalance },
        { label: "GT Main", value: creditInfo?.gtBalanceMain },
        { label: "Cust Bal", value: creditInfo?.customerBalance },
      ].map(({ label, value }) => (
        <BalanceItem key={label} label={label} value={value} />
      ))}
    </div>
  );
};

const Header: React.FC = () => {
  const { user } = useUser();
  const { addToCartCount } = useCartStore();
  const { creditInfo } = useWalletStore();
  const { isOpen, toggleSidebar } = useSidebarStore();
  const navigate = useNavigate();

  const [showWalletModal, setShowWalletModal] = React.useState(false);

  const isOwner = user.type === "OWNER";
  const formattedBalance = `${creditInfo?.currency} ${
    creditInfo?.balance?.toLocaleString("en-US") || "0"
  }`;

  return (
    <>
      <header
        className={`fixed z-30 bg-white top-0 right-0 flex justify-between items-center w-full py-2 px-4 md:px-10 shadow-[0px_8px_12px_0px_#0000000D] transition-all duration-300 ${
          isOpen ? "md:max-w-[calc(100vw-232px)]" : "w-full"
        }`}
      >
        {/* LEFT */}
        <div className="flex gap-4 items-center">
          {/* Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} className="text-gray-700" />
          </button>

          {/* Desktop Wallet */}
          <div className="hidden md:flex p-2 rounded-lg items-center gap-4 bg-indigo-700 text-white shadow-md shadow-indigo-700/20">
            <div className="flex items-center gap-3 pr-4 border-r border-indigo-500/50">
              <div className="p-1.5 bg-white/10 rounded-md">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-indigo-200 uppercase tracking-wider">
                  Available Credits
                </p>
                <p className="text-sm font-bold leading-tight">
                  {formattedBalance}
                </p>
              </div>
            </div>
            {isOwner && <OwnerBalances creditInfo={creditInfo} />}
          </div>

          {/* Mobile Wallet Button */}
          <button
            className="flex md:hidden items-center gap-2 bg-indigo-700 text-white px-3 py-1.5 rounded-md shadow-md active:scale-95 transition-transform"
            onClick={() => setShowWalletModal(true)}
          >
            <Wallet size={18} />
            <span className="text-xs font-bold">{formattedBalance}</span>
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* Cart */}
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

          {/* User */}
          <div
            onClick={() => navigate("/settings/general")}
            className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group pr-2 py-1 hover:bg-gray-50 transition-colors"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                {user?.username || "User"}
              </p>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                {user?.type}
              </p>
            </div>
            <div className="relative shrink-0">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md">
                <img
                  src="https://img.freepik.com/premium-vector/avatar-profil-picture-icon-vector-design-template_393879-5783.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover border-2 border-white"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <ChevronRight
              size={14}
              className="text-gray-400 group-hover:translate-x-0.5 transition-transform"
            />
          </div>
        </div>
      </header>

      {/* Mobile Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-indigo-700 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Wallet size={20} />
                <span className="font-bold">Wallet Details</span>
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="p-1 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 bg-indigo-700">
              <div className="flex items-center gap-3 pb-4 border-b border-indigo-500/50 mb-4">
                <div className="p-1.5 bg-white/10 rounded-md">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-indigo-200 uppercase tracking-wider">
                    Available Credits
                  </p>
                  <p className="text-xl font-bold leading-tight text-white">
                    {formattedBalance}
                  </p>
                </div>
              </div>
              {isOwner && <OwnerBalances creditInfo={creditInfo} cardStyle />}
            </div>

            <div className="bg-gray-50 p-3 text-center text-xs text-gray-500">
              Secure Wallet System
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
