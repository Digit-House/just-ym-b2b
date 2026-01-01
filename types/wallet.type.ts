export interface TransactionT {
    id: string;
    type: 'topup' | 'spent';
    description: string;
    amount: number;
    date: string;
    status: 'pending' | 'completed' | 'failed';
  }
  
  export interface WalletStateT {
    balance: number;
    totalTopUps: number;
    totalSpent: number;
    transactions: TransactionT[];
  }