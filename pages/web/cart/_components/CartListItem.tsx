import { useCartStore } from "@/store/useCartStore";
import { Calendar, Trash2, User } from "lucide-react";

type Props = {
  item: any;
  checked: boolean;
  onToggle: () => void;
};

const CartListItem = ({ item, checked, onToggle }: Props) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <h3 className="font-black text-gray-900 text-lg">
            {item.productName}
          </h3>
        </div>

        <button
          onClick={() => removeItem(item.id)}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Ticket Types */}
      <div className="space-y-4">
        {item.ticketTypes.map((tt: any) => (
          <div
            key={tt.id}
            className="flex items-center justify-between gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-4 h-4 rounded border border-indigo-200 mt-1 flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-600 rounded-sm" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <Calendar size={14} />
                  <span className="text-xs font-bold">{item.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <User size={14} />
                  <span className="text-sm font-black">
                    {tt.quantity} {tt.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, tt.id, -1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                >
                  -
                </button>
                <span className="font-black text-gray-900 w-4 text-center">
                  {tt.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, tt.id, 1)}
                  className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700"
                >
                  +
                </button>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  Price
                </p>
                <p className="font-black text-gray-900">
                  ฿ {(tt.price * tt.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartListItem;
