import { ProductInfoT } from "@/types/product.type";
import React, { useEffect, useState } from "react";
import { addDays, isSameDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  setPickedDate: React.Dispatch<React.SetStateAction<Date>>;
  ticketDetail: ProductInfoT | null;
};

const DatePicker = ({
  selectedDate,
  setSelectedDate,
  setPickedDate,
  ticketDetail,
}: Props) => {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const [blockedDate, setBlockedDate] = React.useState<Date[]>([]);
  const [startDate2, setStartDate2] = React.useState<Date>(today);
  const [month, setMonth] = React.useState<Date>(selectedDate);

  useEffect(() => {
    setMonth(selectedDate);
  }, [selectedDate]);

  React.useEffect(() => {
    if (!ticketDetail) return;

    const normalized =
      ticketDetail.blockedDate?.map((item) => {
        const d = new Date(item.date); // UTC date
        // convert to local day (remove timezone)
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      }) ?? [];

    setBlockedDate(normalized);
  }, [ticketDetail]);

  useEffect(() => {
    if (!ticketDetail) return;
    let date = today;
    if (ticketDetail.productOptions[0]?.advanceBooking?.day) {
      date = addDays(
        selectedDate,
        ticketDetail.productOptions[0]?.advanceBooking?.day
      );
    } else {
      date = today;
    }
    setStartDate2(date);
  }, [ticketDetail]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex flex-col p-3 items-center justify-center border-0 cursor-pointer hover:bg-gray-200/50  transition-all duration-300 rounded-2xl"
        >
          <CalendarIcon className="w-5 h-5 text-indigo-700" />
          <span className="text-sm text-indigo-700 text-nowrap">See More</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          month={month}
          onMonthChange={setMonth}
          captionLayout="dropdown"
          disabled={[
            { before: startDate2 },
            (date) => blockedDate.some((b) => isSameDay(b, date)),
          ]}
          onSelect={(date) => {
            if (!date) return;
            if (blockedDate.some((b) => isSameDay(b, date))) return;
            setSelectedDate(date);
            setPickedDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
