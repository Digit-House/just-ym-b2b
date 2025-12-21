import React from 'react';
import { Bell, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors relative">
          <ShoppingBag size={20} />
        </button>
        <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <img 
            src="https://picsum.photos/id/64/100/100" 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">John Carter</p>
            <p className="text-xs text-gray-500">Account settings</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
