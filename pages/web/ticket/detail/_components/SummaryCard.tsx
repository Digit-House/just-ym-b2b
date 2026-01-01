import React from 'react';
import { MapPin } from 'lucide-react';
import { ProductInfoT, ProductOptionT } from '@/types/product.type';

interface SummaryCardProps {
  product: ProductInfoT;
  currentOption: ProductOptionT;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ product, currentOption }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
    <div className="flex items-center gap-2 text-gray-400 text-sm mb-8">
      <MapPin size={16} />
      <span>{product.location}</span>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm">
      <div className="flex justify-between items-center py-2 border-b border-gray-50">
        <span className="text-gray-500">B2B Rate (Starting)</span>
        <span className="font-bold text-gray-900">THB {currentOption.ticketType[0]?.nettPrice}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-50">
        <span className="text-gray-500">Suggested Retail</span>
        <span className="font-bold text-gray-900">
          {currentOption.ticketType[0]?.dhRecommendedSellingPrice > 0 
            ? `THB ${currentOption.ticketType[0]?.dhRecommendedSellingPrice}` 
            : 'N/A'}
        </span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-50">
        <span className="text-gray-500">Commission</span>
        <span className="font-bold text-gray-900">15%</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-50">
        <span className="text-gray-500">Allotment</span>
        <span className="font-bold text-indigo-600">Available</span>
      </div>
    </div>

    <div className="mt-8 pt-6 flex flex-wrap gap-8 items-center justify-between border-t border-gray-50">
      <div>
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">Valid dates</p>
        <p className="text-sm font-medium text-gray-700">Open-dated: {product.isOpenDated ? 'Yes' : 'No'}</p>
        <p className="text-xs text-gray-500">Valid until: 4/6/2026</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">Blocked Dates</p>
        <div className="flex gap-2 mt-1">
          {product.blockedDate.map((b, i) => (
            <span key={i} className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded">{b.title}</span>
          ))}
          {product.blockedDate.length === 0 && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">None</span>}
        </div>
      </div>
    </div>
  </div>
);

export default SummaryCard;