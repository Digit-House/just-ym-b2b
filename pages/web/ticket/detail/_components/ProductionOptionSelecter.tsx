import {
  ProductOptionT,
  SelectedProductOptionT,
  TicketTypeT,
} from "@/types/product.type";
import { format } from "date-fns";
import { Calendar, Check, CheckIcon, ChevronDown, Clock,  XIcon } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VariantSelecter from "./VariantSelecter";
import { useUser } from "@/provider/UserProvider";

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
  const { user } = useUser();
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
              className={`flex flex-col gap-5 p-4 ${
                selectedProductOption?.id === item.id
                  ? "bg-indigo-100"
                  : "bg-transparent"
              }`}
            >
              <div className="flex flex-col md:flex-row items-start justify-between w-full gap-3">
                <div className="flex flex-col items-start flex-1 gap-2">
                  <p className="text-[#0F172B] font-bold text-base">
                    {item.name}
                  </p>
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
                        <p className=" text-indigo-700 font-bold">
                          ฿{user.type === "OWNER" ? ticket.dhSellingPrice.toFixed(2) : ticket.dhNetPrice.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-[#0F172B]" />
                  <p className="text-sm text-[#0F172B]">
                    {format(new Date(pickedDate), "EEE, MMM dd, yyyy")}
                  </p>
                </div>
                {item.ticketValidity === "Duration" && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-indigo-700" />
                    <p className="text-sm text-indigo-700">
                      Open Date : Bookable for {item.definedDuration} days
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
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
                      🇹🇭 Thai Nation Only
                    </p>
                  )}
                </div>
                <div>
                  {item.isPublished ? (
                    <div className="flex items-center gap-2 px-2 py-1 rounded-[8px] bg-green-200">
                      <CheckIcon  className="w-4 h-4 text-green-500" />

                      <p className="text-green-400 text-xs font-bold">
                        Published
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-2 py-1 rounded-[8px] bg-red-200">
                      <XIcon className="w-4 h-4 text-red-500" />

                      <p className="text-red-400 text-xs font-bold">
                        UnPublished
                      </p>
                    </div>
                  )}
                </div>
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
                    ? "bg-indigo-400 text-white hover:bg-indigo-500/80"
                    : "bg-[#F1F5F9] text-[#314158] hover:bg-[#F1F5F9]/80"
                }`}
              >
                {selectedProductOption?.id === item.id  && selectedProductOption?.ticketType.some((ticket) => ticket.quantity > 0) ? "UnSelect" : selectedProductOption?.id === item.id ? "Selected" : "Select"}
                {/* <p>
                  {selectedProductOption?.id === item.id
                    ? "selected"
                    : "select"}
                </p> */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionOptionSelecter;
