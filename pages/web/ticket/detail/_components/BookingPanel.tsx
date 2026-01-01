import React from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { ProductOptionT } from "@/types/product.type";

interface BookingPanelProps {
  options: ProductOptionT[];
  selectedIndex: number;
  onSelectIndex: (i: number) => void;
  quantities: { [key: string]: number };
  onUpdateQty: (id: string, delta: number) => void;
  totalPrice: number;
}

const BookingPanel: React.FC<BookingPanelProps> = ({
  options,
  selectedIndex,
  onSelectIndex,
  quantities,
  onUpdateQty,
  totalPrice,
}) => {
  const getPackageName = (opt: ProductOptionT) =>
    opt.ticketType.map((tt) => tt.name).join(" + ") + " Package";
  const currentOption = options[selectedIndex];

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Book Ticket</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Select Package
          </label>
          <div className="relative">
            <select
              value={selectedIndex}
              onChange={(e) => onSelectIndex(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none pr-10"
            >
              {options.map((opt, i) => (
                <option key={i} value={i}>
                  {getPackageName(opt)}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-5.25 pointer-events-none text-gray-400">
              <Plus size={16} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {currentOption.ticketType.map((tt) => (
            <div
              key={tt.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white hover:border-indigo-100 transition-colors"
            >
              <div className="flex-1">
                <p className="text-sm font-black text-gray-900">{tt.name}</p>
                <p className="text-xs text-indigo-600 font-bold">
                  THB {tt.dhSellingPrice}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onUpdateQty(tt.id, -1)}
                  className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-4 text-center font-black text-gray-900">
                  {quantities[tt.id] || 0}
                </span>
                <button
                  onClick={() => onUpdateQty(tt.id, 1)}
                  className="w-9 h-9 rounded-full border border-indigo-100 flex items-center justify-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100">
          <div className="flex justify-between items-end mb-8">
            <span className="text-sm font-black text-gray-900 uppercase tracking-wider">
              Total Payment
            </span>
            <div className="text-right">
              <span className="text-xl font-black text-indigo-600">
                ฿ {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-100 transform active:scale-[0.98]">
              Next
            </button>
            <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPanel;
