import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "@/components/Header";
import { getMe } from "@/graphql/user";
import { useUser } from "@/provider/UserProvider";
import { getCredictInfo } from "@/graphql/wallet";
import { useWalletStore } from "@/store/useWalletStore";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";

const DashboardLayout = () => {
  const { setUser, fetchWallet } = useUser();
  const { setCreditInfo } = useWalletStore();
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

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    fetchCreditInfo();
  }, [fetchWallet]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />
      <main className="flex-1 ml-64 transition-all duration-300 ease-in-out p-8 mt-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
