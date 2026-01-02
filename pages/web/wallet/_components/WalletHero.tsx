
import React from 'react';
import { Wallet, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WalletHeroProps {
  balance: number;
  currency?: string;
}

const WalletHero: React.FC<WalletHeroProps> = ({currency, balance }) => (
  <div className="bg-indigo-600 h-37.5 rounded-3xl p-8 text-white relative overflow-hidden shadow-sm shadow-indigo-100 mb-5">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
          <Wallet size={32} />
        </div>
        <div>
          <p className="text-white/70 text-sm font-medium mb-1">Total Available Credits</p>
          <h2 className="text-3xl font-black">{currency}&nbsp;{balance}</h2>
        </div>
      </div>
      <Link 
        to="/wallet/topup"
        className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-50 transition-all transform active:scale-95 shadow-lg"
      >
        <Plus size={20} strokeWidth={3} />
        Top Up Credits
      </Link>
    </div>
  </div>
);

export default WalletHero;
