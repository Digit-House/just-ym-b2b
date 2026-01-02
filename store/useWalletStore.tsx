import { CreditInfoT } from "@/types/wallet.type";
import { create } from "zustand";


type WalletState = {
  creditInfo: CreditInfoT | null;
  isLoading: boolean;

  // actions
  setCreditInfo: (credit: CreditInfoT) => void;
  clearCredit: () => void;
  topUp: (amount: number) => void;
  spend: (amount: number) => void;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  creditInfo: null,
  isLoading: false,

  /* ---------------- Actions ---------------- */

  setCreditInfo: (credit) =>
    set({
      creditInfo: credit,
    }),

  clearCredit: () =>
    set({
      creditInfo: null,
    }),

  topUp: (amount) => {
    const credit = get().creditInfo;
    if (!credit) return;

    set({
      creditInfo: {
        ...credit,
        balance: credit.balance + amount,
        totalTopUp: credit.totalTopUp + amount,
      },
    });
  },

  spend: (amount) => {
    const credit = get().creditInfo;
    if (!credit) return;

    set({
      creditInfo: {
        ...credit,
        balance: credit.balance - amount,
        totalUsage: credit.totalUsage + amount,
      },
    });
  },
}));
