import React from 'react';
import {
  TrendingUp,
  CreditCard,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  FileImage,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TopUpHistoryT} from '@/types/wallet.type';
import ImagePreview from '@/components/ImagePreview';

// Extend dayjs to use relative time if desired
dayjs.extend(relativeTime);

interface TransactionListProps {
  topUpData: TopUpHistoryT[];
}

// Helper to get status styles
const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'completed' || s === 'success') {
    return {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      icon: <CheckCircle size={14} className="mr-1" />,
    };
  }
  if (s === 'pending') {
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      icon: <Clock size={14} className="mr-1" />,
    };
  }
  return {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: <AlertCircle size={14} className="mr-1" />,
  };
};

// Helper to generate initials for avatar
const getInitials = (name?: string) => {
  if (!name) return 'NA';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const TransactionList: React.FC<TransactionListProps> = ({ topUpData }) => {
  if (!topUpData || topUpData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-400">
        <TrendingUp className="mb-3 opacity-20" size={48} />
        <p className="font-medium">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
          <p className="text-xs text-gray-500 mt-0.5">Recent top-ups and balance adjustments</p>
        </div>
        <div className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
          Total: {topUpData.length}
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {topUpData.map((tx) => {
          const statusStyle = getStatusStyles(tx.status);
          
          return (
            <div
              key={tx.id}
              className="group px-6 py-6 hover:bg-gray-50/80 transition-all duration-200"
            >
              {/* --- Main Row: Amount & Reseller --- */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                {/* Left: Reseller Info */}
                <div className="flex items-center gap-4">
                  {/* <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {getInitials(tx.reseller?.name)}
                  </div> */}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-gray-900">
                        {tx.reseller?.name || 'Unknown Reseller'}
                      </p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wide">
                        Top Up
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {dayjs(tx.createdAt).format('MMM D, YYYY')}
                      </span>
                      {tx.updatedAt !== tx.createdAt && (
                        <span className="text-[10px] text-gray-400">
                          • Updated {dayjs(tx.updatedAt).fromNow()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Status */}
                <div className="flex items-center gap-6 sm:justify-end">
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900 tracking-tight">
                      {tx.currency}
                      {tx.topUpBalance.toLocaleString()}
                    </p>
                    <div className={`mt-1 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.icon}
                      {tx.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Detail Grid --- */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
                
                {/* Col 1: Payment Method (Width: 5/12) */}
                <div className="md:col-span-5 flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
                    <CreditCard size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Payment Method
                    </p>
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {tx.paymentMethod?.bankName || 'Direct Transfer'}
                    </p>
                    <p className="text-xs text-gray-500 truncate font-mono">
                      {tx.paymentMethod?.accountNumber} ({tx.paymentMethod?.accountName})
                    </p>
                  </div>
                </div>

                {/* Col 2: Audit Trail (Created By / Confirmed By) (Width: 4/12) */}
                <div className="md:col-span-4 flex items-center gap-2 overflow-hidden">
                  {/* Creator */}
                  <div className="flex items-center gap-2 min-w-0">
                    <User size={14} className="text-gray-400 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Created By</span>
                      <span className="text-xs font-medium text-gray-600 truncate">
                        {tx.createdBy?.email || 'System'}
                      </span>
                    </div>
                  </div>

                  {/* Arrow if confirmed */}
                  {tx.status.toLowerCase() === 'completed' && tx.confirmBy && (
                    <>
                      <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Approved By</span>
                          <span className="text-xs font-medium text-gray-900 truncate">
                            {tx.confirmBy?.email}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Col 3: Images (Width: 3/12) */}
                <div className="md:col-span-3 flex items-start justify-end gap-2">
                  {tx.relatedImages && tx.relatedImages.length > 0 ? (
                    <div className="flex items-center gap-2 w-full justify-end">
                       <div className="flex flex-col items-end">
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Proof</p>
                          <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors">
                             <FileImage size={14} />
                             {tx.relatedImages.length} Image{tx.relatedImages.length > 1 ? 's' : ''}
                          </div>
                          <ImagePreview
                             images={tx.relatedImages}
                             title={`Proof for ${tx.reseller?.name}`}
                          />
                       </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-300 italic font-medium">No proof provided</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;