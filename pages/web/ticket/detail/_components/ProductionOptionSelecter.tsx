import {
  ProductOptionT,
  SelectedProductOptionT,
  TicketTypeT,
} from "@/types/product.type";
import { Check } from "lucide-react";
import React from "react";

type Props = {
  loading: boolean;
  productOptions: ProductOptionT[];
  selectedProductOption: SelectedProductOptionT | null;
  setSelectedProductOption: React.Dispatch<
    React.SetStateAction<SelectedProductOptionT | null>
  >;
};

const ProductionOptionSelecter = ({
  loading,
  productOptions,
  selectedProductOption,
  setSelectedProductOption,
}: Props) => {
  const handleSelected = (item: ProductOptionT) => {
    if (selectedProductOption?.id === item.id) {
      setSelectedProductOption(null);
      return;
    }
    const selectedTicketType = item.ticketType.map((data: TicketTypeT) => {
      return {
        ...data,
        quantity: 0,
      };
    });
    const selectedData: SelectedProductOptionT = {
      id: item.id,
      ticketType: selectedTicketType,
      totalPrice: 0,
      name: item.name,
      visitDate: item.visitDate,
      questions: item.questions,
      isCapacity: item.isCapacity,
    };
    setSelectedProductOption(selectedData);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <h5>What do you prefer?</h5>
      <div className="flex items-stretch w-full gap-6 mt-4 overflow-x-scroll scrollbar-hide">
        {productOptions.map((item) => (
          <div
            key={item.id}
            className="flex-1 min-w-60.75 max-w-60.75 border border-[#D9D9D9] rounded-2xl flex flex-col divide-y divide-[#D9D9D9]"
          >
            <div className="flex flex-col justify-between flex-1 gap-6 p-4">
              <div className="min-h-14">
                <p className="line-clamp-2">{item.name}</p>
              </div>
              <div>
                {/* {item.ticketType[0].originalPrice <
                  item.ticketType[0].dhSellingPrice && (
                  <p>฿ {item.ticketType[0].originalPrice.toFixed(2)}</p>
                )} */}
                {/* <Typo
                  text={`฿${item.ticketType[0].originalPrice.toFixed(2)}`}
                  size="md"
                  className="text-black line-through"
                /> */}

                <div className="flex items-center gap-3 mt-3 mb-4">
                  {/* <Typo
                    text={`฿ ${item.ticketType[0].dhSellingPrice.toFixed(2)}`}
                    size="md"
                    className="text-black"
                  /> */}
                  <p>฿ ${item.ticketType[0].dhNetPrice.toFixed(2)}</p>
                  {/* {item.ticketType[0].originalPrice <
                    item.ticketType[0].dhSellingPrice && (
                    <p>
                      {(
                        ((item.ticketType[0].originalPrice -
                          item.ticketType[0].dhSellingPrice) /
                          item.ticketType[0].originalPrice) *
                        100
                      ).toFixed(2)}
                      % off
                    </p>
                  )} */}
                </div>
                <button
                  onClick={() => handleSelected(item)}
                  className={`w-full flex items-center justify-center gap-2 border border-indigo-700 rounded-[12px] p-3 cursor-pointer hover:bg-[#F0EBF8]/50 text-black transition-all duration-300
                    ${
                      selectedProductOption?.id === item.id
                        ? "bg-[#F0EBF8] "
                        : ""
                    }
                    `}
                >
                  {selectedProductOption?.id === item.id && (
                    <Check className="w-5 h-5" />
                  )}
                  {/* <Typo
                    text={
                      selectedPackage?.id === item.id ? "Selected" : "Select"
                    }
                    size="md"
                    className="text-black"
                  /> */}
                  <span>
                    {selectedProductOption?.id === item.id
                      ? "Selected"
                      : "Select"}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <ul className="flex flex-col gap-1">
                {item.inclusions.map((d: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-base text-gray-500"
                  >
                    <div className="h-1 mt-3 rounded-full min-w-1 bg-gray-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionOptionSelecter;
