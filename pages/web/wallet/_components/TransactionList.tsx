import React, { useState } from 'react';
import { TrendingUp, X } from 'lucide-react';
import dayjs from 'dayjs';
import { TopUpHistoryT } from '@/types/wallet.type';

interface TransactionListProps {
  topUpData: TopUpHistoryT[];
}

const TransactionList: React.FC<TransactionListProps> = ({ topUpData }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

                {/* Related Images Thumbnails */}
                {tx.relatedImages && tx.relatedImages.length > 0 && (
                  <div className="mt-3 flex gap-2 justify-end">
                    {tx.relatedImages.map((imgUrl, index) => (
                      <div 
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => setPreviewImage(imgUrl)}
                      >
                        <img
                          src={imgUrl}
                          alt={`Transaction proof ${index + 1}`}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 group-hover:opacity-80 transition-opacity"
                        />
                        {/* Hover overlay to indicate clickability */}
                        <div className="absolute inset-0 bg-black/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="text-white text-[10px] font-bold">View</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Preview Modal / Popup */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors p-2"
            >
              <X size={32} />
            </button>
            <img
              src={previewImage}
              alt="Full size preview"
              className="w-full h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionList;