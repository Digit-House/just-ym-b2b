
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardsProps {
  totalTopUps: number;
  totalSpent: number;
}

const StatCards: React.FC<StatCardsProps> = ({ totalTopUps, totalSpent }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between group hover:border-indigo-100 transition-colors">
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Total Top Ups</p>
        <h3 className="text-3xl font-black text-gray-900 mb-4">${totalTopUps.toLocaleString()}</h3>
        <div className="flex items-center gap-2 text-xs text-green-500 font-bold">
          <TrendingUp size={14} />
          <span>This month</span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
        <TrendingUp size={20} />
      </div>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between group hover:border-orange-100 transition-colors">
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Total Spent</p>
        <h3 className="text-3xl font-black text-gray-900 mb-4">${totalSpent.toLocaleString()}</h3>
        <div className="flex items-center gap-2 text-xs text-orange-500 font-bold">
          <TrendingDown size={14} />
          <span>On bookings</span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
        <TrendingDown size={20} />
      </div>
    </div>
  </div>
);

export default StatCards;
