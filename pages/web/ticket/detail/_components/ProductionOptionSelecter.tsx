import {
  ProductOptionT,
  SelectedProductOptionT,
  TicketTypeT,
} from "@/types/product.type";
import { format } from "date-fns";
import { Calendar, Check, ChevronDown, Clock } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VariantSelecter from "./VariantSelecter";

type Props = {
  loading: boolean;
  productOptions: ProductOptionT[];
  selectedProductOption: SelectedProductOptionT | null;
  setSelectedProductOption: React.Dispatch<
    React.SetStateAction<SelectedProductOptionT | null>
  >;
  pickedDate: Date;
  isManual: boolean;
};

const ProductionOptionSelecter = ({
  loading,
  productOptions,
  selectedProductOption,
  setSelectedProductOption,
  pickedDate,
  isManual,
}: Props) => {
  const [detailOpenId, setDetailOpenId] = useState<string | null>(null);
  const handleSelected = (item: ProductOptionT) => {
    if (selectedProductOption?.id === item.id) {
      setSelectedProductOption(null);
      return;
    }
    const selectedTicketType = item?.ticketType?.map((data: TicketTypeT) => {
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
      <div className="flex flex-col w-full gap-6 mt-4 overflow-x-scroll scrollbar-hide">
        {productOptions.map((item) => (
          <div
            key={item.id}
            className={`flex-1 w-full border border-[#E2E8F0] rounded-[10px] flex flex-col  overflow-hidden  ${
              selectedProductOption?.id === item.id
                ? "border-indigo-700"
                : "divide-[#D9D9D9]"
            }`}
          >
            {/* title */}
            <div
              className={`flex p-4 ${
                selectedProductOption?.id === item.id
                  ? "bg-indigo-100"
                  : "bg-transparent"
              }`}
            >
              <div className="flex items-start justify-between w-full gap-3">
                <div className="flex flex-col items-start flex-1 gap-2">
                  <p className="text-[#0F172B] font-bold text-base">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-[#0F172B]" />
                    <p className="text-sm text-[#0F172B]">
                      {format(new Date(pickedDate), "EEE, MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isManual ? (
                      <div className="flex items-center gap-2 px-2 py-1 rounded-[8px] bg-[#FEF3C6]">
                        <Clock className="w-4 h-4 text-[#BB4D00]" />

                        <p className="text-[#BB4D00] text-xs font-bold">
                          Awaiting Approval
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-2 py-1 rounded-[8px] bg-[#DCFCE7]">
                        <Check className="w-4 h-4 text-[#008236]" />

                        <p className="text-[#008236] font-bold text-xs">
                          Instant Confirmation
                        </p>
                      </div>
                    )}
                    {item.thaiNationalOnly && (
                      <p className="px-2 py-0.5 rounded-full bg-[#155DFC] text-white text-xs">
                        Thai Nation Only
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (detailOpenId === item.id) setDetailOpenId(null);
                      else setDetailOpenId(item.id);
                    }}
                    className="flex items-center gap-1 cursor-pointer text-indigo-700 hover:text-indigo-700/80 transition-all duration-300 "
                  >
                    <p className="text-xs">Package Details</p>
                    <ChevronDown
                      className={`w-4 h-4 transitaion-all duration-300 ${
                        detailOpenId === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* right side */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 divide-x">
                    {item.ticketType.map((ticket, i: number) => (
                      <div
                        key={ticket.id}
                        className={`flex items-center gap-1 ${
                          i === item.ticketType.length - 1 ? "pr-0" : "pr-2"
                        }`}
                      >
                        <p className="text-[#050505] capitalize text-sm">{`${ticket.name.toLowerCase()}:`}</p>
                        {/* <Typo
                          text={`฿ ${
                            locale === "en"
                              ? ticket.dhSellingPrice.toFixed(2)
                              : toMyanmarNumber(
                                  ticket.dhSellingPrice.toFixed(2)
                                )
                          }`}
                          size="md"
                          className="text-[#F54900]"
                          fontWeight="bold"
                        /> */}
                        <p className=" text-indigo-700 font-bold">
                          ฿{ticket.dhNetPrice.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Section */}
            <AnimatePresence initial={false}>
              {detailOpenId === item.id && (
                <motion.div
                  className="w-full px-4 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="w-full py-3 border-t border-[#E2E8F0] flex flex-col gap-3">
                    {item.description && (
                      <p className="text-[#0F172B] text-xs">
                        {item.description}
                      </p>
                    )}
                    {item.inclusions.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-[#0F172B] font-bold text-xs">
                          What's Included
                        </p>
                        <div className="flex flex-col gap-2">
                          {item.inclusions.map((inclusion) => (
                            <div
                              key={inclusion}
                              className="flex items-center gap-2"
                            >
                              <Check className="w-3.5 h-3.5 text-[#008236]" />
                              {/* <Typo
                                    text={inclusion}
                                    size="xs"
                                    className="text-[#314158]"
                                  /> */}
                              <p className="text-[#314158] text-xs">
                                {inclusion}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {selectedProductOption &&
                selectedProductOption?.id === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <VariantSelecter
                      selectedProductOption={selectedProductOption}
                      setSelectedProductOption={setSelectedProductOption}
                    />
                  </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full px-4 py-3">
              <button
                onClick={() => {
                  handleSelected(item);
                }}
                className={`w-full rounded-[8px] font-bold text-sm cursor-pointer py-2 px-4 flex items-center justify-center transition-all duration-300 ${
                  selectedProductOption?.id === item.id
                    ? "bg-indigo-700 text-white hover:bg-indigo-700/80"
                    : "bg-[#F1F5F9] text-[#314158] hover:bg-[#F1F5F9]/80"
                }`}
              >
                <p>
                  {selectedProductOption?.id === item.id
                    ? "selected"
                    : "select"}
                </p>
              </button>
            </div>
            {/* <div className="flex flex-col justify-between flex-1 gap-6 p-4">
              <div className="min-h-14">
                <p className="line-clamp-2">{item.name}</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mt-3 mb-4">
                  <p>฿ ${item.ticketType[0].dhNetPrice.toFixed(2)}</p>
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
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionOptionSelecter;
