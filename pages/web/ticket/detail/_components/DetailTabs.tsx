import React from 'react';
import { ShieldCheck, FileText, Download } from 'lucide-react';
import { ProductInfoT } from '@/types/product.type';


interface DetailTabsProps {
  product: ProductInfoT;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DetailTabs: React.FC<DetailTabsProps> = ({ product, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'highlights', label: 'Highlights' },
    { id: 'inclusion', label: 'Inclusion & Expectation' },
    { id: 'terms', label: 'Booking Terms' },
    { id: 'notes', label: 'Special Notes' }
  ];

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex gap-8 border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      <div className="text-gray-600 text-sm leading-relaxed min-h-[200px]">
        {activeTab === 'highlights' && (
          <ul className="space-y-4">
            {product.highlights.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'inclusion' && (
          <div className="space-y-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">Inclusions</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.inclusions.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                    <ShieldCheck size={18} className="text-green-500 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-xs">What to expect</h4>
              <p className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-50">{product.whatToExpect}</p>
            </div>
          </div>
        )}
        {activeTab === 'terms' && (
          <div 
            className="prose prose-sm prose-indigo max-w-none" 
            dangerouslySetInnerHTML={{ __html: product.termsAndConditions }} 
          />
        )}
        {activeTab === 'notes' && (
          <ul className="space-y-3">
            {product.thingsToNote.map((item, i) => (
              <li key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-50 italic text-gray-500">
                <span className="text-indigo-400 font-bold">#</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-50 flex flex-wrap gap-4">
        <button className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all">
          <FileText size={16} /> Rate Sheet (PDF)
        </button>
        <button className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all">
          <FileText size={16} /> Marketing Assets
        </button>
        <button className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all">
          <Download size={16} /> Agreements
        </button>
      </div>
    </div>
  );
};

export default DetailTabs;