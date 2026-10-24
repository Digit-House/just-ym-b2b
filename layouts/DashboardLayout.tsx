import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { getMe } from "@/graphql/user";
import { useUser } from "@/provider/UserProvider";
import { getCredictInfo } from "@/graphql/wallet";
import { useWalletStore } from "@/store/useWalletStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";
import { useCartStore } from "@/store/useCartStore";
import { getAddToCartCount } from "@/graphql/product";
import { useResize } from "@/hooks/useResizer";

const DashboardLayout = () => {
  const { setUser, fetchWallet } = useUser();
  const { setCreditInfo } = useWalletStore();
  const { setAddToCartCount } = useCartStore();
  const { isOpen, toggleSidebar } = useSidebarStore();
  const [loading, setLoading] = React.useState(true);
  const isDesktop = useResize();
  const location = useLocation();

  const fetchMe = async () => {
    try {
      const res: any = await getMe();
      setUser(res?.data?.me);
    } catch (err) {
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const fetchCreditInfo = async () => {
    try {
      const res: any = await getCredictInfo();
      setCreditInfo(res.data.getCreditInfo);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }
  };

  const fetchAddToCartCount = async () => {
    try {
      const res: any = await getAddToCartCount();
      if (res.data) {
        setAddToCartCount(res.data.myCart.itemsCount);
      }
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }
  };

  useEffect(() => {
    fetchMe();
    fetchAddToCartCount();
  }, []);

  useEffect(() => {
    fetchCreditInfo();
  }, [fetchWallet]);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (!isDesktop && isOpen) {
      toggleSidebar();
    }
  }, [location.pathname]);

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — always rendered, visibility controlled inside Sidebar */}
      <Sidebar />

      {/* Main content — only offset on desktop when sidebar is open */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isOpen && isDesktop ? "ml-64" : "ml-0"
        }`}
      >
        <Header />
        <main className="mt-14 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
