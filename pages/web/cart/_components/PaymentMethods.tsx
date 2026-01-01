import { CreditCard, Landmark, QrCode } from "lucide-react";
import { useState } from "react";

const PaymentMethods = () => {
  const [method, setMethod] = useState("card");
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-8">
      <h3 className="text-xl font-black text-gray-900 mb-6">
        Select your payment method
      </h3>
      <div className="space-y-4">
        <div
          className={`p-6 rounded-2xl border transition-all ${
            method === "card"
              ? "border-indigo-600 ring-2 ring-indigo-50"
              : "border-gray-100"
          }`}
        >
          <label className="flex items-center gap-3 cursor-pointer mb-6">
            <input
              type="radio"
              checked={method === "card"}
              onChange={() => setMethod("card")}
              className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="font-black text-gray-900 flex items-center gap-2">
              <CreditCard size={18} /> Credit or debit card
            </span>
          </label>

          {method === "card" && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
              <div className="col-span-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="JOHN DOE"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>
        {[
          { id: "qr", label: "QR Prompt Payment", icon: QrCode },
          { id: "banking", label: "Banking", icon: Landmark },
          { id: "transfer", label: "Bank Transfer", icon: Landmark },
        ].map((m) => (
          <label
            key={m.id}
            className={`flex items-center gap-3 p-6 rounded-2xl border cursor-pointer transition-all ${
              method === m.id
                ? "border-indigo-600 ring-2 ring-indigo-50"
                : "border-gray-100"
            }`}
          >
            <input
              type="radio"
              checked={method === m.id}
              onChange={() => setMethod(m.id)}
              className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="font-black text-gray-900 flex items-center gap-2">
              <m.icon size={18} /> {m.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;