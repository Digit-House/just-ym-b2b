import React from "react";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CartListItem from "./_components/CartListItem";
import EmptyCart from "./_components/EmptyCart";
import { useUser } from "@/provider/UserProvider";
import PageHeader from "@/components/PageHeader";
import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";

const Cart = () => {
  const { user } = useUser();
  const { items, getTotal, clearCart } = useCartStore();

  const subtotal = getTotal();
  const discount = subtotal > 5000 ? 500 : 0;
  const finalTotal = subtotal - discount;

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
     <PageContainer>
      <BackBtn route="/tickets" title="Back" />

      <PageHeader
        title="Add To Cart"
        des="Complete your booking details and payment information."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6 px-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked
                readOnly
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-black text-gray-500">
                Selected ({items.length} Items)
              </span>
            </label>
            <button
              onClick={clearCart}
              className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
            >
              <Trash2 size={14} /> Delete All
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <CartListItem key={item.id} item={item} />
            ))}
          </div>

          {/* <PaymentMethods /> */}

          <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100 flex gap-4 text-red-600">
            <div className="w-6 h-6 rounded-full border-2 border-red-200 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-black">!</span>
            </div>
            <p className="text-xs font-bold leading-relaxed">
              Once a Booking is completed, it cannot be cancelled with a refund,
              unless otherwise stated in the Listing or the Supplier Terms
              applicable to such Listing.
            </p>
          </div>

          <div className="mt-12 flex items-center justify-between bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div>
              <p className="text-lg font-black text-gray-900">
                Total Payment :{" "}
                <span className="text-indigo-600">
                  ฿ {finalTotal.toLocaleString()}
                </span>
              </p>
              <p className="text-[10px] text-gray-400 font-bold mt-1">
                By continuing, you agree to the General Terms, Privacy Policy,
                and the Cancellation Policy
              </p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all transform active:scale-95">
              Confirm Payment
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm sticky top-8">
            <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute rotate-45 -top-10 -right-10 w-40 h-40 bg-white"></div>
                <div className="absolute rotate-45 bottom-0 -left-10 w-20 h-20 bg-white"></div>
              </div>
              <h3 className="text-xl font-black relative z-10">
                Order Summary
              </h3>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Billing Info
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-medium">Name:</span>
                    <span className="text-indigo-600 font-black">
                      {user?.username}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-medium">Email:</span>
                    <span className="text-indigo-600 font-black">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Pricing Breakdown
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-black text-gray-900">
                      Subtotal
                    </span>
                    <span className="text-sm font-black text-indigo-600">
                      ฿ {subtotal.toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between p-3 bg-green-50 rounded-xl">
                      <span className="text-xs font-black text-green-700">
                        Loyalty Discount
                      </span>
                      <span className="text-xs font-black text-green-700">
                        - ฿ {discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                <span className="text-lg font-black text-gray-900">Total</span>
                <span className="text-xl font-black text-indigo-600">
                  ฿ {finalTotal.toLocaleString()}
                </span>
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg transition-colors mt-4">
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      </div>
      </PageContainer>
  );
};

export default Cart;
