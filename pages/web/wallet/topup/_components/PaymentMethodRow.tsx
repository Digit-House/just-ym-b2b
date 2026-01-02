import { CreditCard, Landmark, Check } from "lucide-react";

type Props = {
  value: "card" | "bank";
  selected: "card" | "bank";
  onChange: (value: "card" | "bank") => void;
};

export const PaymentMethodRow = ({
  value,
  selected,
  onChange,
}: Props) => {
  const isActive = selected === value;

  return (
    <label
      className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${
        isActive
          ? "border-indigo-600 bg-indigo-50"
          : "border-gray-100 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-4">
        <input
          type="radio"
          checked={isActive}
          onChange={() => onChange(value)}
          className="w-5 h-5 text-indigo-600"
        />

        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isActive
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {value === "card" ? (
              <CreditCard size={20} />
            ) : (
              <Landmark size={20} />
            )}
          </div>

          <div>
            <p className="text-sm font-black text-gray-900">
              {value === "card" ? "Credit Card" : "Bank Transfer"}
            </p>
            <p className="text-[10px] text-gray-400 font-bold">
              {value === "card"
                ? "Visa ending in 4242"
                : "Manual approval required"}
            </p>
          </div>
        </div>
      </div>

      {isActive && <Check size={20} className="text-indigo-600" />}
    </label>
  );
};
