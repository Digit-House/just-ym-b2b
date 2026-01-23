import React from "react";
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
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TopUpHistoryT } from "@/types/wallet.type";
import ImagePreview from "@/components/ImagePreview";
import { BASE_CURRENCY, convertCurrency, currencyFormat, formatCurrency } from "@/lib/utils";

// Extend dayjs to use relative time
dayjs.extend(relativeTime);

interface TransactionListProps {
  topUpData: TopUpHistoryT[];
}

// Helper to get status styles
const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  if (s === "completed" || s === "success") {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100",
      icon: <CheckCircle size={14} className="mr-1.5" />,
    };
  }
  if (s === "pending") {
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-100",
      icon: <Clock size={14} className="mr-1.5" />,
    };
  }
  return {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
    icon: <AlertCircle size={14} className="mr-1.5" />,
  };
};

const TransactionList: React.FC<TransactionListProps> = ({ topUpData }) => {
  if (!topUpData || topUpData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
        <div className="p-3 bg-gray-50 rounded-full mb-4">
          <TrendingUp size={24} className="opacity-50" />
        </div>
        <p className="font-medium text-gray-500">No transactions found</p>
        <p className="text-xs mt-1">Top-up history will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Transaction History
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage and review balance adjustments
          </p>
        </div>
        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">
          {topUpData.length} Records
        </span>
      </div>

      <div className="divide-y divide-gray-200">
        {topUpData.map((tx) => {
          const statusStyle = getStatusStyles(tx.status);

          return (
            <div
              key={tx.id}
              className="group p-5 hover:bg-gray-50/50 transition-colors duration-200"
            >
              {/* --- Top Section: Summary (Who, When, How Much, Status) --- */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                {/* Left: Reseller & Date */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-base font-bold text-gray-900 truncate">
                      {tx.reseller?.name || "Unknown Reseller"}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide">
                      Top Up
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 gap-4">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      <Calendar size={12} className="text-gray-400" />
                      {dayjs(tx.createdAt).format("MMM D, YYYY • h:mm A")}
                    </span>
                    {tx.updatedAt !== tx.createdAt && (
                      <span className="text-[10px] text-gray-400 italic">
                        Updated {dayjs(tx.updatedAt).fromNow()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Status */}
                <div className="flex items-center gap-6 md:justify-end">
                  <div className="text-right">
                    <div className="flex flex-col gap-1">
                      <p className="text-md font-bold text-gray-900 tracking-tight">
                      TOP UP AMOUNT : {tx?.currency} {tx.topUpBalance.toLocaleString()}
                      </p>
                      {tx.paymentMethod.currency === "MMK" &&
                        tx.currencyRate?.mmk && (
                          <p className="text-sm text-gray-500 font-mono">
                            TOP UP AMOUNT (MMK) : {formatCurrency(
                              convertCurrency(
                                tx.topUpBalance,
                                "THB",
                                "MMK",
                                Number(tx.currencyRate.mmk)
                              ),
                              "MMK",
                              "en-US"
                            )}
                            
                          </p>
                        )}
                      {tx?.currencyRate?.mmk && tx?.paymentMethod?.currency === "MMK" && (
                        <div>
                          <p className="text-xs text-gray-500 font-mono">
                            {currencyFormat(BASE_CURRENCY,"MMK","en-MM")} to {currencyFormat(+tx?.currencyRate?.mmk, "MMK", "en-US")}
                          </p>
                        </div>
                      )}
                    </div>
                    <div
                      className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {statusStyle.icon}
                      {tx.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-sm">
                <div className="md:col-span-5 flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600 border border-gray-100">
                    <CreditCard size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Method
                    </p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {tx.paymentMethod?.bankName || "Direct Transfer"}
                    </p>
                    <p className="text-xs text-gray-500 font-mono truncate">
                      {tx.paymentMethod?.accountNumber} (
                      {tx.paymentMethod?.accountName})
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4 flex items-center justify-center md:justify-start overflow-hidden">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Created
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                          {tx.createdBy?.email?.charAt(0).toUpperCase() || "S"}
                        </div>
                        <span className="text-xs font-medium text-gray-600 truncate">
                          {tx.createdBy?.email?.split("@")[0] || "System"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 px-1">
                      {tx.status.toLowerCase() === "completed" ? (
                        <ArrowRight size={14} className="text-emerald-500" />
                      ) : (
                        <div className="w-[1px] h-4 bg-gray-300 mx-auto" />
                      )}
                    </div>

                    <div className="flex flex-col items-start min-w-0 flex-1">
                      {tx.status.toLowerCase() === "completed" &&
                      tx.confirmBy ? (
                        <>
                          <span className="text-[10px] text-emerald-600/80 font-bold uppercase mb-0.5">
                            Approved
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                              {tx.confirmBy.email?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-bold text-gray-900 truncate">
                              {tx.confirmBy.email?.split("@")[0]}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic mt-5">
                          Pending...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 flex items-start justify-end">
                  {tx.relatedImages && tx.relatedImages.length > 0 ? (
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <div className="group/btn cursor-pointer">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-indigo-500 shadow-sm group-hover/btn:bg-indigo-50 group-hover/btn:border-indigo-200 transition-all">
                          <FileImage size={18} />
                        </div>
                        <p className="text-[10px] font-medium text-center mt-1 text-gray-500">
                          {tx.relatedImages.length} Proof
                        </p>
                        <ImagePreview
                          images={tx.relatedImages}
                          title={`Proof for ${tx.reseller?.name}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <FileImage size={14} />
                      <span className="text-[10px] font-medium italic">
                        No Proof
                      </span>
                    </div>
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
