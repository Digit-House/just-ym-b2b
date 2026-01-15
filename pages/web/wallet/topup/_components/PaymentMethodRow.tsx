import { CreditCard, Landmark, Check } from "lucide-react";
import { PaymentMethodT } from "@/types/paymentMethod.type";

type Props = {
  method: PaymentMethodT;
  selected: boolean;
  onSelect: () => void;
};

export const PaymentMethodRow = ({ method, selected, onSelect }: Props) => {
  return (
    <label
      className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${
        selected
          ? "border-indigo-600 bg-indigo-50"
          : "border-gray-100 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-4">
        <input
          type="radio"
          checked={selected}
          onChange={onSelect}
          className="w-5 h-5 text-indigo-600"
        />

        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              selected
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {method.type === "QR_CODE" ? (
              <CreditCard size={20} />
            ) : (
              <Landmark size={20} />
            )}
          </div>

          <div>
            <p className="text-sm font-black text-gray-900">
              {method.name}
            </p>
            <p className="text-[10px] text-gray-400 font-bold">
              {method.type === "QR_CODE"
                ? "Scan QR with your mobile banking app"
                : "Transfer via bank account & upload slip"}
            </p>
            {method.bankName && (
              <p className="text-[10px] text-gray-500 mt-1">
                {method.bankName}
              </p>
            )}
          </div>
        </div>
      </div>

      {selected && <Check size={20} className="text-indigo-600" />}
    </label>
  );
};
