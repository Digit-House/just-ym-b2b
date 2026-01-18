import WalletHero from "./_components/WalletHero";
import StatCards from "./_components/StatCards";
import TransactionList from "./_components/TransactionList";
import { useWalletStore } from "@/store/useWalletStore";
import PageHeader from "@/components/PageHeader";
import PageContainer from "@/components/PageContainer";
import {TopUpHistoryFilterT, TopUpHistoryT } from "@/types/wallet.type";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";
import {getTopupHistory } from "@/graphql/wallet";

const Wallet = () => {

  const { creditInfo } = useWalletStore();
  const [topUpData,setTopUpData] = useState<TopUpHistoryT[]>([]);
  const [filterData, _] = useState<TopUpHistoryFilterT>({
    limit: 10,
    orderBy: {
      dir: "desc",
    },
    page: 1,
    status: null,
  });

  useEffect(() => {
    fetchTopUpHistory();
  }, [filterData]);

  const fetchTopUpHistory = async () => {
    try {
      const res:any = await getTopupHistory(filterData);
      setTopUpData(res?.data?.findAllTopUpHistory?.data);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Wallet"
        des="Manage your credits and view transaction history"
      />

      <div className="flex flex-col gap-0">
        <WalletHero balance={creditInfo?.balance} currency={creditInfo?.currency} />
        <StatCards
          currency={creditInfo?.currency}
          totalTopUps={creditInfo?.totalTopUp}
          totalSpent={creditInfo?.totalUsage}
        />
       {topUpData.length > 0 && <TransactionList topUpData={topUpData} />}
      </div>
    </PageContainer>
  );
};

export default Wallet;
