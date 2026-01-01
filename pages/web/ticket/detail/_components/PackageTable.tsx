import { ProductOptionT } from '@/types/product.type';
import React from 'react';


interface PackageTableProps {
  options: ProductOptionT[];
}

const PackageTable: React.FC<PackageTableProps> = ({ options }) => {
  const getPackageName = (opt: ProductOptionT) => opt.ticketType.map(tt => tt.name).join(' + ') + ' Package';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 px-2">Package Info</h2>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-indigo-50/50 text-indigo-900 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold">Package Variant</th>
                <th className="px-6 py-4 font-bold">Net Price</th>
                <th className="px-6 py-4 font-bold">Selling Price</th>
                <th className="px-6 py-4 font-bold">Commission</th>
                <th className="px-6 py-4 font-bold">Allotment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {options.map((opt, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{getPackageName(opt)}</div>
                    <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">SKU: {opt.ticketType[0]?.sku}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-600">THB {opt.ticketType[0]?.nettPrice}</td>
                  <td className="px-6 py-4 font-bold text-indigo-700">THB {opt.ticketType[0]?.dhSellingPrice}</td>
                  <td className="px-6 py-4 text-green-600 font-bold">15%</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">
                      {opt.ticketType[0]?.issuanceLimit ? `${opt.ticketType[0]?.issuanceLimit}/day` : 'Unlimited'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackageTable;