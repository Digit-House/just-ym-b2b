import React from 'react';
import { TrendingUp } from 'lucide-react';
import dayjs from 'dayjs';
import { TopUpHistoryT } from '@/types/wallet.type';
import ImagePreview from '@/components/ImagePreview';

interface TransactionListProps {
  topUpData: TopUpHistoryT[];
}

const TransactionList: React.FC<TransactionListProps> = ({ topUpData }) => {
  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50">
          <h3 className="text-xl font-black text-gray-900">Transaction History</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {topUpData.map((tx) => (
            <div key={tx.id} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50 text-green-500">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">
                    Top Up {tx.reseller?.name ? `- ${tx.reseller.name}` : ''}
                  </p>
                  <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                    {dayjs(tx.createdAt).format('MMM D, YYYY')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex flex-col items-end">
                  <p className="text-sm font-black mb-1 text-green-600">
                    +{tx.currency}
                    {tx.topUpBalance.toLocaleString()}
                  </p>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                      tx.status.toLowerCase() === 'completed' || tx.status.toLowerCase() === 'success'
                        ? 'bg-green-100 text-green-600'
                        : tx.status.toLowerCase() === 'pending'
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>

                {/* Related Images using ImagePreview component */}
                {tx.relatedImages && tx.relatedImages.length > 0 && (
                  <div className="mt-3">
                    <ImagePreview 
                      images={tx.relatedImages}
                      title={`Transaction Proof - ${tx.reseller?.name || 'Unknown'}`}
                      className="flex justify-end"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>


    </>
  );
};

export default TransactionList;