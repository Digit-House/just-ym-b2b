import React, { useEffect, useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { ProductInfoT } from "@/types/product.type";
import DatePicker from "./DatePicker";

type SevenDayPickerProps = {
  pickedDate: Date;
  setPickedDate: (date: Date) => void;
  product: ProductInfoT | null;
};

const SevenDayPicker = ({
  pickedDate,
  setPickedDate,
  product,
}: SevenDayPickerProps) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const [selectedDate, setSelectedDate] = useState<Date>(tomorrow);
  const [dayList, setDayList] = useState<Date[]>([]);
  const [blockedDate, setBlockedDate] = useState<Date[]>([]);

  useEffect(() => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));
    setDayList(days);
  }, [selectedDate]);
  
  return (
    <div className="w-full ">
      <h5 className="mb-3">Select Date</h5>
      <div className="grid grid-cols-8 w-full gap-5 ">
        {dayList.map((d, i) => {
          const isSelected =
            pickedDate &&
            format(pickedDate, "yyyy-MM-dd") === format(d, "yyyy-MM-dd");

          const isDisable = blockedDate.some((b) => isSameDay(b, d));
          return (
            <button
              key={i}
              className={`w-full h-full col-span-1 flex flex-col items-center justify-center text-center gap-3 py-4 rounded-2xl text-sm ${
                isSelected
                  ? "bg-[#F0EBF8] border border-[#673AB7] "
                  : isDisable
                  ? " text-[#21212140]/25"
                  : " text-gray-600"
              }`}
              onClick={() => setPickedDate(d)}
            >
              <span>{format(d, "EEE")}</span>
              <span>{format(d, "MMM d")}</span>
              <span
                className={`px-3 py-0.5 rounded-2xl   ${
                  isDisable ? "bg-[#21212108]/30" : " bg-[#C4E9C7]"
                }`}
              >
                {format(d, "yyyy")}
              </span>
            </button>
          );
        })}
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          ticketDetail={product}
          setPickedDate={setPickedDate}
        />
      </div>
    </div>
  );
};

export default SevenDayPicker;
