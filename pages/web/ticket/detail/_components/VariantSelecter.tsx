import { SelectedProductOptionT, TicketTypeT } from "@/types/product.type";
import { Minus, Plus } from "lucide-react";
import React from "react";

type Props = {
  selectedProductOption: SelectedProductOptionT;
  setSelectedProductOption: React.Dispatch<
    React.SetStateAction<SelectedProductOptionT | null>
  >;
};

const VariantSelecter = ({
  selectedProductOption,
  setSelectedProductOption,
}: Props) => {
  const handleDecrease = (item: TicketTypeT) => {
    if (item.quantity <= 0) return;
    const updatedVariants = {
      ...item,
      quantity:
        item.minPurchaseQty > 0 && item.quantity === item.minPurchaseQty
          ? item.quantity - item.minPurchaseQty
          : item.quantity - 1,
    };
    const totalPrice =
      item.minPurchaseQty > 0 && item.quantity === item.minPurchaseQty
        ? selectedProductOption.totalPrice -
          item.dhNetPrice * item.minPurchaseQty
        : selectedProductOption.totalPrice - item.dhNetPrice;
    const variants = selectedProductOption.ticketType.map((variant: any) => {
      if (variant.id === item.id) {
        return updatedVariants;
      }
      return variant;
    });
    setSelectedProductOption({
      ...selectedProductOption,
      totalPrice: totalPrice,
      ticketType: variants,
    });
  };

  const handleIncrease = (item: TicketTypeT) => {
    if (
      item.maxPurchaseQty !== null &&
      item.maxPurchaseQty !== undefined &&
      item.quantity >= item.maxPurchaseQty
    ) {
      return;
    }
    const updatedVariants = {
      ...item,
      quantity:
        item.minPurchaseQty > 1 && item.quantity === 0
          ? item.quantity + item.minPurchaseQty
          : item.quantity + 1,
    };
    const totalPrice =
      item.minPurchaseQty > 1 && item.quantity === 0
        ? selectedProductOption.totalPrice +
          item.dhNetPrice * item.minPurchaseQty
        : selectedProductOption.totalPrice + item.dhNetPrice;
    const variants = selectedProductOption.ticketType.map((variant: any) => {
      if (variant.name === item.name) {
        return updatedVariants;
      }
      return variant;
    });
    setSelectedProductOption({
      ...selectedProductOption,
      totalPrice: totalPrice,
      ticketType: variants,
    });
  };
  return (
    <div className="w-full">
      <h5>Guest</h5>
      <div className="mt-4 border border-[#D9D9D9] rounded-2xl p-6 w-full flex flex-col lg:gap-10 md:gap-6 gap-2">
        {selectedProductOption.ticketType.map((item: TicketTypeT) => (
          <div
            className="lg:gap-10 gap-5 grid grid-cols-4 items-center"
            key={item.id}
          >
            <div className="flex flex-col flex-1 gap-2 col-span-2">
              <p className="text-black text-xl font-bold">{item.name}</p>
              {item.ageFrom && item.ageTo && (
                <p className="text-nowrap">
                  {item.ageFrom} yrs to {item.ageTo} yrs
                </p>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 ">
              <div className="flex items-center gap-2 lg:gap-10 md:gap-5 ">
                <button
                  disabled={item.quantity <= 0}
                  onClick={() => {
                    handleDecrease(item);
                  }}
                  className={`md:p-3 p-1 rounded-full  flex justify-center items-center cursor-pointer ${
                    item.quantity <= 0
                      ? "bg-[rgba(33,33,33,0.06)]"
                      : "bg-[#F0EBF8]"
                  }`}
                >
                  <Minus
                    className={`w-3 h-3 md:w-5 md:h-5 ${
                      item.quantity <= 0 ? "text-[#727171]" : " text-indigo-700"
                    }`}
                  />
                </button>
                <p className="text-black text-xl font-bold">{item.quantity}</p>
                <button
                  className={`md:p-3 p-1 rounded-full flex justify-center items-center cursor-pointer ${
                    item.maxPurchaseQty !== null &&
                    item.quantity >= item.maxPurchaseQty
                      ? "bg-[rgba(33,33,33,0.06)]"
                      : "bg-[#F0EBF8]"
                  }`}
                  disabled={
                    item.maxPurchaseQty !== null &&
                    item.quantity >= item.maxPurchaseQty
                  }
                  onClick={() => {
                    handleIncrease(item);
                  }}
                >
                  <Plus
                    className={`w-3 h-3 md:w-5 md:h-5 ${
                      item.maxPurchaseQty !== null &&
                      item.quantity >= item.maxPurchaseQty
                        ? "text-[#727171]"
                        : "text-indigo-700"
                    }`}
                  />
                </button>
              </div>
              {item.minPurchaseQty && item.minPurchaseQty > 0 && (
                // <Typo
                //   text={`Minimum ${item.minPurchaseQty} tickets required`}
                //   size={isMobile ? "xs" : "sm"}
                //   className="text-red"
                // />
                <p className="text-red-500 text-sm">
                  Minimum {item.minPurchaseQty} tickets required
                </p>
              )}
            </div>
            <div className="flex gap-4 col-span-1 justify-end items-center">
              <div
                className={`flex flex-col gap-2 ${
                  item.originalPrice < item.dhNetPrice
                    ? " justify-between"
                    : " justify-center"
                }`}
              >
                <p className="font-medium">฿ {item.dhNetPrice.toFixed(2)}</p>
                {/* {item.originalPrice < item.dhNetPrice && (
                  <p className="line-through font-medium">
                    ฿ {item.originalPrice.toFixed(2)}
                  </p>
                )} */}
              </div>
              {/* {item.originalPrice < item.dhNetPrice && (
                <div>
                  <p className="md:px-2 md:py-1 px-1 py-0.5 rounded-full bg-[#c4e9c7]">
                    {(
                      ((item.originalPrice - item.dhNetPrice) /
                        item.originalPrice) *
                      100
                    ).toFixed(2)}
                    % off
                  </p>
                </div>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantSelecter;
