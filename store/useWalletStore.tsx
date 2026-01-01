import { TransactionT, WalletStateT } from "@/types/wallet.type";
import { create } from "zustand";


interface WalletActions {
  topUp: (amount: number, description: string) => void;
  spend: (amount: number, description: string) => void;
}

export const useWalletStore = create<WalletStateT & WalletActions>((set) => ({
  balance: 15000,
  totalTopUps: 30000,
  totalSpent: 13500,
  transactions: [
    { id: '1', type: 'topup', description: 'Credit Top Up', amount: 10000, date: 'Dec 30, 2025', status: 'pending' },
    { id: '2', type: 'spent', description: '6 Nights at Amanpuri, Phuket', amount: 6750, date: 'Dec 27, 2024', status: 'completed' },
    { id: '3', type: 'topup', description: 'Credit Top Up', amount: 5000, date: 'Dec 25, 2024', status: 'completed' },
    { id: '4', type: 'spent', description: '6 Nights at Amanpuri, Phuket', amount: 6750, date: 'Dec 24, 2024', status: 'completed' },
    { id: '5', type: 'topup', description: 'Credit Top Up', amount: 15000, date: 'Dec 20, 2024', status: 'completed' },
  ],
  topUp: (amount, description) => set((state) => {
    const newTransaction: TransactionT = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'topup',
      description,
      amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'pending'
    };
    return {
      transactions: [newTransaction, ...state.transactions],
      // For demo purposes, we don't immediately update balance on pending top-ups if we follow "admin approval" logic
      // but we will update for the UI feel in some cases.
    };
  }),
  spend: (amount, description) => set((state) => {
     const newTransaction: TransactionT = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'spent',
      description,
      amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'completed'
    };
    return {
      balance: state.balance - amount,
      totalSpent: state.totalSpent + amount,
      transactions: [newTransaction, ...state.transactions]
    };
  })
}));
