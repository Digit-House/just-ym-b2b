import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Landmark,
  Info,
  Copy,
  Check,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import PageHeader from "@/components/PageHeader";
import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";

const TOPUP_PRESETS = [
  { label: "$1K", amount: 1000, value: 1000 },
  { label: "$3K", amount: 3000, value: 2500 }, // Matching image weird pricing ($3k for 2500?)
  { label: "$5K", amount: 5000, value: 5000 },
  { label: "$10K", amount: 10000, value: 10000 },
  { label: "$25K", amount: 25000, value: 25000 },
];

const BankDetailRow = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 flex items-center justify-between group">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-sm font-black text-gray-900">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
      >
        {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
      </button>
    </div>
  );
};

const TopUp = () => {
  const navigate = useNavigate();
  const { balance, topUp } = useWalletStore();
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleComplete = () => {
    setIsProcessing(true);
    // Simulate API
    setTimeout(() => {
      topUp(selectedAmount, "Credit Top Up");
      navigate("/wallet");
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  return (
    <PageContainer>
      <BackBtn route="/wallet" title="Back to Wallet" />
      <PageHeader
        title="Top Up Credits"
        des="Add credits to your wallet to continue booking tickets"
      />

      <div className="space-y-8">
        {/* Balance Preview Card */}
        <div className="bg-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/4 -translate-y-1/4 blur-2xl"></div>
          <div className="flex flex-col gap-6 relative z-10">
            <div>
              <p className="text-white/70 text-sm font-bold mb-1">
                Current Balance
              </p>
              <h3 className="text-4xl font-black">
                ${balance.toLocaleString()}
              </h3>
            </div>
            <div className="space-y-2 border-t border-white/20 pt-6">
              <div className="flex justify-between items-center text-white/80">
                <span className="text-xs font-bold uppercase tracking-widest">
                  Top up amount:
                </span>
                <span className="text-lg font-black">
                  +${selectedAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span className="text-sm font-black uppercase tracking-widest">
                  New balance:
                </span>
                <span className="text-3xl font-black">
                  ${(balance + selectedAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">
            Select Amount
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {TOPUP_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setSelectedAmount(p.amount)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                  selectedAmount === p.amount
                    ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50"
                    : "border-gray-100 hover:border-indigo-200 bg-white"
                }`}
              >
                <span
                  className={`text-xl font-black ${
                    selectedAmount === p.amount
                      ? "text-indigo-600"
                      : "text-gray-900"
                  }`}
                >
                  {p.label}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  ${p.value.toLocaleString()}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-50">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                $
              </span>
              <input
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-8 text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                USD ▾
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-2">
              Minimum top-up amount is $100
            </p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-gray-900">Payment Method</h3>
            <button className="text-xs font-black text-indigo-600 hover:underline">
              + Add New
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === "card"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="w-5 h-5 text-indigo-600"
                />
                <div>
                  <p className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <CreditCard size={18} /> Credit Card
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                    Visa ending in 4242
                  </p>
                </div>
              </div>
            </label>

            <label
              className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === "bank"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="w-5 h-5 text-indigo-600"
                />
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      paymentMethod === "bank"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Landmark size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">
                      Bank Transfer
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                      KBZ Bank ****5678
                    </p>
                  </div>
                </div>
              </div>
              {paymentMethod === "bank" && (
                <Check size={20} className="text-indigo-600" />
              )}
            </label>
          </div>
        </div>

        {/* Bank Transfer Flow - Conditional Section */}
        {paymentMethod === "bank" && (
          <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
            {/* Bank Transfer Details */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Landmark size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Bank Transfer Details
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold">
                    Use these details to make your payment
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <BankDetailRow label="Bank Name" value="KBZ Bank" />
                <BankDetailRow
                  label="Account Name"
                  value="JustYm Services Ltd"
                />
                <BankDetailRow
                  label="Account Number"
                  value="1234 5678 1928 19283"
                />
                <BankDetailRow label="Routing Number" value="123456789" />
                <BankDetailRow label="SWIFT Code" value="JYSTUS33" />

                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">
                      Reference Number (Important!)
                    </p>
                    <p className="text-sm font-black text-orange-600 uppercase">
                      TOP78004132
                    </p>
                    <p className="text-[10px] text-orange-400 font-bold mt-1 italic">
                      Please include this in your transfer
                    </p>
                  </div>
                  <button className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-100 rounded-lg transition-all">
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-6">
                Upload Payment Proof
              </h3>

              {!proofFile ? (
                <div className="border-4 border-dashed border-gray-100 rounded-3xl p-12 flex flex-col items-center text-center group hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    accept="image/*,.pdf"
                  />
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <h4 className="text-base font-black text-gray-900 mb-1">
                    Click to upload payment receipt
                  </h4>
                  <p className="text-xs text-gray-400 font-bold">
                    Supported formats: JPG, PNG, PDF (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-200 flex items-center justify-between animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl border border-indigo-100 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-sm"></div>{" "}
                      {/* File icon simulation */}
                    </div>
                    <div>
                      <p className="text-sm font-black text-indigo-900">
                        {proofFile.name}
                      </p>
                      <p className="text-[10px] text-indigo-400 font-bold">
                        {(proofFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setProofFile(null)}
                      className="text-indigo-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {proofFile && (
                <button className="w-full text-center mt-6 text-indigo-600 font-bold text-xs hover:underline">
                  Change File
                </button>
              )}
            </div>
          </div>
        )}

        {/* Important Info Box */}
        <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
          <div className="flex items-start gap-4 text-blue-600">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Info size={14} strokeWidth={3} />
            </div>
            <div>
              <h4 className="text-sm font-black mb-3">Important Information</h4>
              <ul className="text-xs space-y-2 font-bold text-blue-500/80 list-disc pl-4">
                <li>Credits never expire</li>
                <li>Instant credit after payment (Credit Card)</li>
                <li>Non-refundable once added</li>
                <li>Secure payment processing</li>
                {paymentMethod === "bank" && (
                  <li className="text-orange-600">
                    Credits will be added within 24 hours after admin approval
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Final Actions */}
        <div className="flex gap-4 pt-8">
          <button
            onClick={() => navigate("/wallet")}
            className="flex-1 bg-white border border-gray-100 text-gray-500 py-5 rounded-2xl font-black hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={(paymentMethod === "bank" && !proofFile) || isProcessing}
            className="flex-[1.5] bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isProcessing
              ? "Processing..."
              : `Complete Top Up - $${selectedAmount.toLocaleString()}`}
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default TopUp;
