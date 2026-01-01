import React from "react";
import WalletHero from "./_components/WalletHero";
import StatCards from "./_components/StatCards";
import TransactionList from "./_components/TransactionList";
import { useWalletStore } from "@/store/useWalletStore";
import PageHeader from "@/components/PageHeader";

const Wallet = () => {
  const { balance, totalTopUps, totalSpent, transactions } = useWalletStore();

  return (
    <div className="w-full mx-auto animate-in fade-in duration-500">
      <PageHeader
        title="Wallet"
        des="Manage your credits and view transaction history"
      />

      <div className="flex flex-col gap-0">
        <WalletHero balance={balance} />
        <StatCards totalTopUps={totalTopUps} totalSpent={totalSpent} />
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default Wallet;
