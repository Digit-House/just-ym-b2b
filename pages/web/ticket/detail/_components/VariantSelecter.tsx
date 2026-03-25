import { useUser } from "@/provider/UserProvider";
import { SelectedProductOptionT, TicketTypeT } from "@/types/product.type";
import { Minus, Plus } from "lucide-react";
import React from "react";

type Props = {
  selectedProductOption: SelectedProductOptionT | null;
  setSelectedProductOption: React.Dispatch<
    React.SetStateAction<SelectedProductOptionT | null>
  >;
};

const VariantSelecter = ({
  selectedProductOption,
  setSelectedProductOption,
}: Props) => {
  const { user } = useUser();

  const getItemPrice = (item: TicketTypeT): number =>
    user.type === "OWNER" ? item.dhSellingPrice : item.dhNetPrice;

  const isAtMin = (item: TicketTypeT): boolean =>
    item.minPurchaseQty > 0 && item.quantity === item.minPurchaseQty;

  const isAtMax = (item: TicketTypeT): boolean =>
    item.maxPurchaseQty != null && item.quantity >= item.maxPurchaseQty;

  const updateVariants = (
    item: TicketTypeT,
    updatedItem: TicketTypeT
  ): TicketTypeT[] =>
    selectedProductOption!.ticketType.map((variant: TicketTypeT) =>
      variant.id === item.id ? updatedItem : variant
    );

  const handleDecrease = (item: TicketTypeT): void => {
    if (item.quantity <= 0) return;

    const price = getItemPrice(item);
    const decrementBy = isAtMin(item) ? item.minPurchaseQty : 1;

    const updatedItem: TicketTypeT = {
      ...item,
      quantity: item.quantity - decrementBy,
    };

    setSelectedProductOption({
      ...selectedProductOption!,
      totalPrice: selectedProductOption!.totalPrice - price * decrementBy,
      ticketType: updateVariants(item, updatedItem),
    });
  };

  const handleIncrease = (item: TicketTypeT): void => {
    if (isAtMax(item)) return;

    const price = getItemPrice(item);
    const isFirstPurchase = item.minPurchaseQty > 1 && item.quantity === 0;
    const incrementBy = isFirstPurchase ? item.minPurchaseQty : 1;

    const updatedItem: TicketTypeT = {
      ...item,
      quantity: item.quantity + incrementBy,
    };

    setSelectedProductOption({
      ...selectedProductOption!,
      totalPrice: selectedProductOption!.totalPrice + price * incrementBy,
      ticketType: updateVariants(item, updatedItem),
    });
  };

  if (!selectedProductOption) return null;

  return (
    <div className="w-full px-4">
      <div className="border-y border-[#E2E8F0] py-3 w-full flex flex-col gap-4">
        {selectedProductOption.ticketType.map((item: TicketTypeT) => (
          <div
            className="lg:gap-10 gap-5 grid grid-cols-4 items-center"
            key={item.id}
          >
            {/* Name & Age */}
            <div className="flex flex-col flex-1 gap-2 col-span-2">
              <p className="text-black text-base font-bold">{item.name}</p>
              {item.ageFrom && item.ageTo && (
                <p className="text-nowrap text-sm">
                  {item.ageFrom} yrs to {item.ageTo} yrs
                </p>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 lg:gap-10 md:gap-5">
                <button
                  disabled={item.quantity <= 0}
                  onClick={() => handleDecrease(item)}
                  className={`w-8 h-8 rounded-full flex justify-center items-center cursor-pointer ${
                    item.quantity <= 0
                      ? "bg-[rgba(33,33,33,0.06)]"
                      : "bg-[#F0EBF8]"
                  }`}
                >
                  <Minus
                    className={`w-3 h-3 md:w-5 md:h-5 ${
                      item.quantity <= 0 ? "text-[#727171]" : "text-indigo-700"
                    }`}
                  />
                </button>

                <p className="text-black text-xl font-bold">{item.quantity}</p>

                <button
                  disabled={isAtMax(item)}
                  onClick={() => handleIncrease(item)}
                  className={`w-8 h-8 rounded-full flex justify-center items-center cursor-pointer ${
                    isAtMax(item)
                      ? "bg-[rgba(33,33,33,0.06)]"
                      : "bg-[#F0EBF8]"
                  }`}
                >
                  <Plus
                    className={`w-3 h-3 md:w-5 md:h-5 ${
                      isAtMax(item) ? "text-[#727171]" : "text-indigo-700"
                    }`}
                  />
                </button>
              </div>

              {item.minPurchaseQty > 0 && (
                <p className="text-red-500 text-sm">
                  Minimum {item.minPurchaseQty} tickets required
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex gap-4 col-span-1 justify-end items-center">
              <p className="font-medium">
                ฿ {getItemPrice(item).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantSelecter;

/**
 * @old_version
 */

// import { useUser } from "@/provider/UserProvider";
// import { SelectedProductOptionT, TicketTypeT } from "@/types/product.type";
// import { Minus, Plus } from "lucide-react";
// import React from "react";

// type Props = {
//   selectedProductOption: SelectedProductOptionT | null;
//   setSelectedProductOption: React.Dispatch<
//     React.SetStateAction<SelectedProductOptionT | null>
//   >;
// };

// const VariantSelecter = ({
//   selectedProductOption,
//   setSelectedProductOption,
// }: Props) => {
//   const {user} = useUser();
//   //i want to make this
//   const handleDecrease = (item: TicketTypeT) => {
//     {user.type === "OWNER" ? item.dhSellingPrice.toFixed(2) : item.dhNetPrice.toFixed(2)}
//     if (item.quantity <= 0) return;
//     const updatedVariants = {
//       ...item,
//       quantity:
//         item.minPurchaseQty > 0 && item.quantity === item.minPurchaseQty
//           ? item.quantity - item.minPurchaseQty
//           : item.quantity - 1,
//     };
//     const totalPrice =
//       item.minPurchaseQty > 0 && item.quantity === item.minPurchaseQty
//         ? selectedProductOption.totalPrice -
//           item.dhNetPrice * item.minPurchaseQty
//         : selectedProductOption.totalPrice - item.dhNetPrice;
//     const variants = selectedProductOption.ticketType.map((variant: any) => {
//       if (variant.id === item.id) {
//         return updatedVariants;
//       }
//       return variant;
//     });
//     setSelectedProductOption({
//       ...selectedProductOption,
//       totalPrice: totalPrice,
//       ticketType: variants,
//     });
//   };

//   const handleIncrease = (item: TicketTypeT) => {
//     if (
//       item.maxPurchaseQty !== null &&
//       item.maxPurchaseQty !== undefined &&
//       item.quantity >= item.maxPurchaseQty
//     ) {
//       return;
//     }
//     const updatedVariants = {
//       ...item,
//       quantity:
//         item.minPurchaseQty > 1 && item.quantity === 0
//           ? item.quantity + item.minPurchaseQty
//           : item.quantity + 1,
//     };
//     const totalPrice =
//       item.minPurchaseQty > 1 && item.quantity === 0
//         ? selectedProductOption.totalPrice +
//           item.dhNetPrice * item.minPurchaseQty
//         : selectedProductOption.totalPrice + item.dhNetPrice;
//     const variants = selectedProductOption.ticketType.map((variant: any) => {
//       if (variant.name === item.name) {
//         return updatedVariants;
//       }
//       return variant;
//     });
//     setSelectedProductOption({
//       ...selectedProductOption,
//       totalPrice: totalPrice,
//       ticketType: variants,
//     });
//   };

//   if (!selectedProductOption) return null;
//   return (
//     <div className="w-full px-4">
//       <div className="border-y border-[#E2E8F0] py-3 w-full flex flex-col gap-4">
//         {selectedProductOption.ticketType.map((item: TicketTypeT) => (
//           <div
//             className="lg:gap-10 gap-5 grid grid-cols-4 items-center"
//             key={item.id}
//           >
//             <div className="flex flex-col flex-1 gap-2 col-span-2">
//               <p className="text-black text-base font-bold">{item.name}</p>
//               {item.ageFrom && item.ageTo && (
//                 <p className="text-nowrap text-sm">
//                   {item.ageFrom} yrs to {item.ageTo} yrs
//                 </p>
//               )}
//             </div>
//             <div className="flex flex-col items-center gap-2 ">
//               <div className="flex items-center gap-2 lg:gap-10 md:gap-5 ">
//                 <button
//                   disabled={item.quantity <= 0}
//                   onClick={() => {
//                     handleDecrease(item);
//                   }}
//                   className={`w-8 h-8 rounded-full  flex justify-center items-center cursor-pointer ${
//                     item.quantity <= 0
//                       ? "bg-[rgba(33,33,33,0.06)]"
//                       : "bg-[#F0EBF8]"
//                   }`}
//                 >
//                   <Minus
//                     className={`w-3 h-3 md:w-5 md:h-5 ${
//                       item.quantity <= 0 ? "text-[#727171]" : " text-indigo-700"
//                     }`}
//                   />
//                 </button>
//                 <p className="text-black text-xl font-bold">{item.quantity}</p>
//                 <button
//                   className={`w-8 h-8 rounded-full flex justify-center items-center cursor-pointer ${
//                     item.maxPurchaseQty !== null &&
//                     item.quantity >= item.maxPurchaseQty
//                       ? "bg-[rgba(33,33,33,0.06)]"
//                       : "bg-[#F0EBF8]"
//                   }`}
//                   disabled={
//                     item.maxPurchaseQty !== null &&
//                     item.quantity >= item.maxPurchaseQty
//                   }
//                   onClick={() => {
//                     handleIncrease(item);
//                   }}
//                 >
//                   <Plus
//                     className={`w-3 h-3 md:w-5 md:h-5 ${
//                       item.maxPurchaseQty !== null &&
//                       item.quantity >= item.maxPurchaseQty
//                         ? "text-[#727171]"
//                         : "text-indigo-700"
//                     }`}
//                   />
//                 </button>
//               </div>
//               {item.minPurchaseQty && item.minPurchaseQty > 0 && (
//                 <p className="text-red-500 text-sm">
//                   Minimum {item.minPurchaseQty} tickets required
//                 </p>
//               )}
//             </div>
//             <div className="flex gap-4 col-span-1 justify-end items-center">
//               <div
//                 className={`flex flex-col gap-2 ${
//                   item.originalPrice < item.dhNetPrice
//                     ? " justify-between"
//                     : " justify-center"
//                 }`}
//               >
//                 <p className="font-medium">฿ {item.dhNetPrice.toFixed(2)}</p>{" "}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VariantSelecter;
