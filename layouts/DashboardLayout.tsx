import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
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

const DashboardLayout = () => {
  const { setUser, fetchWallet } = useUser();
  const { setCreditInfo } = useWalletStore();
  const { setAddToCartCount } = useCartStore();
  const { isOpen } = useSidebarStore();
  const [loading, setLoading] = React.useState(true);

  const fetchMe = async () => {
    try {
      const res: any = await getMe();
      setUser(res?.data?.me);
    } catch (err) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen">
      {isOpen && <Sidebar />}
      <Header />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out p-8 mt-10 ${
          isOpen ? "ml-58" : "ml-0"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
