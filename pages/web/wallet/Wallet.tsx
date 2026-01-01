import React from "react";
import WalletHero from "./_components/WalletHero";
import StatCards from "./_components/StatCards";
import TransactionList from "./_components/TransactionList";
import { useWalletStore } from "@/store/useWalletStore";
import PageHeader from "@/components/PageHeader";
import PageContainer from "@/components/PageContainer";

const Wallet = () => {
  const { balance, totalTopUps, totalSpent, transactions } = useWalletStore();

  return (
    <PageContainer>
      <PageHeader
        title="Wallet"
        des="Manage your credits and view transaction history"
      />

      <div className="flex flex-col gap-0">
        <WalletHero balance={balance} />
        <StatCards totalTopUps={totalTopUps} totalSpent={totalSpent} />
        <TransactionList transactions={transactions} />
      </div>
    </PageContainer>
  );
};

export default Wallet;
