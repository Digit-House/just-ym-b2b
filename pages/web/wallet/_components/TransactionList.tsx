
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { TransactionT } from '@/types/wallet.type';


interface TransactionListProps {
  transactions: TransactionT[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-8 py-6 border-b border-gray-50">
      <h3 className="text-xl font-black text-gray-900">Transaction History</h3>
    </div>
    <div className="divide-y divide-gray-50">
      {transactions.map((tx) => (
        <div key={tx.id} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
          <div className="flex items-center gap-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              tx.type === 'topup' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
            }`}>
              {tx.type === 'topup' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">{tx.description}</p>
              <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">{tx.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-black mb-1 ${
              tx.type === 'topup' ? 'text-green-600' : 'text-red-600'
            }`}>
              {tx.type === 'topup' ? '+' : '-'}${tx.amount.toLocaleString()}
            </p>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
              tx.status === 'completed' ? 'bg-green-100 text-green-600' : 
              tx.status === 'pending' ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'
            }`}>
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TransactionList;
