import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

type Props = {
  label: string;
  value: string;
};

export const BankDetailRow = ({ label, value }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-sm font-black text-gray-900">{value}</p>
      </div>

      <button
        onClick={handleCopy}
        type="button"
        className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
      >
        {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
      </button>
    </div>
  );
};
