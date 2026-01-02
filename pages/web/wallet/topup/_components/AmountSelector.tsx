import { TOPUP_PRESETS } from "@/util/initData";

type Props = {
  value: number;
  onChange: (amount: number) => void;
};

export const AmountSelector = ({ value, onChange }: Props) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-black mb-6">Select Amount</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {TOPUP_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(p.amount)}
            className={`p-6 rounded-2xl border-2 transition-all ${
              value === p.amount
                ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50"
                : "border-gray-100 hover:border-indigo-200"
            }`}
          >
            <span className="text-xl font-black">{p.label}</span>
            <span className="block text-[10px] text-gray-400 font-bold uppercase mt-1">
              THB {p.value.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
        Or Enter Custom Amount
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
};
