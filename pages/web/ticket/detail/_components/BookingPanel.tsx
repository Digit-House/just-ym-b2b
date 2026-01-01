import React from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { ProductInfoT, ProductOptionT } from "@/types/product.type";
import { useCartStore } from "@/store/useCartStore";
import { CartItemT } from "@/types/cart.type";

interface BookingPanelProps {
  product: ProductInfoT;
  options: ProductOptionT[];
  selectedIndex: number;
  onSelectIndex: (i: number) => void;
  quantities: { [key: string]: number };
  onUpdateQty: (id: string, delta: number) => void;
  totalPrice: number;
}

const BookingPanel: React.FC<BookingPanelProps> = ({
  product,
  options,
  selectedIndex,
  onSelectIndex,
  quantities,
  onUpdateQty,
  totalPrice,
}) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const getPackageName = (opt: ProductOptionT) =>
    opt.ticketType.map((tt) => tt.name).join(" + ") + " Package";
  const currentOption = options[selectedIndex];

  const handleProcessOrder = (isDirectBooking: boolean) => {
    const selectedTickets = currentOption.ticketType
      .filter((tt) => quantities[tt.id] > 0)
      .map((tt) => ({
        id: tt.id,
        name: tt.name,
        quantity: quantities[tt.id],
        price: tt.dhSellingPrice,
      }));

    if (selectedTickets.length === 0) {
      alert("Please select at least one ticket type.");
      return;
    }

    const cartItem: CartItemT = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      productName: product.name,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      ticketTypes: selectedTickets,
    };

    addItem(cartItem);
    navigate("/cart");
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Book Ticket</h2>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">
          Instant Confirm
        </span>
      </div>

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
            <div className="absolute right-4 top-[20px] pointer-events-none text-gray-400">
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
              Total
            </span>
            <div className="text-right">
              <span className="text-xl font-black text-indigo-600">
                ฿ {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleProcessOrder(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-100 transform active:scale-[0.98]"
            >
              Book Now
            </button>
            <button
              onClick={() => handleProcessOrder(false)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPanel;
