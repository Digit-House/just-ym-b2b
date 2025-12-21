import React, { useState } from "react";
import { VOUCHERS } from "../../constants";
import { Ticket, Clock, CheckCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const Vouchers = () => {
  const [activeTab, setActiveTab] = useState<"yours" | "claim">("yours");

  return (
    <div className="w-full mx-auto">
      <PageHeader
        title="Vouchers"
        des="You can claim your gift vouchers and view all vouchers here. "
      />
      <div className="flex gap-8 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("yours")}
          className={`pb-4 text-sm font-medium transition-colors relative ${
            activeTab === "yours"
              ? "text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          You Vouchers (4)
          {activeTab === "yours" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("claim")}
          className={`pb-4 text-sm font-medium transition-colors relative ${
            activeTab === "claim"
              ? "text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          To Be Claimed
          {activeTab === "claim" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VOUCHERS.map((voucher) => (
          <div
            key={voucher.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            {/* Left Decorative Part */}
            <div
              className={`w-24 h-24 sm:w-20 sm:h-20 rounded-xl ${voucher.bgColor} flex items-center justify-center text-white shrink-0`}
            >
              <Ticket size={32} className="transform -rotate-45" />
            </div>

            {/* Content */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {voucher.discount}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {voucher.description}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-400">
                {voucher.status === "Active" ? (
                  <Clock size={14} />
                ) : (
                  <CheckCircle size={14} />
                )}
                <span>
                  {voucher.status === "Active"
                    ? `Expire on ${voucher.expiry}`
                    : voucher.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vouchers;
