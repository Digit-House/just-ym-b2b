"use client";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { getTicketTypeEventAvailable } from "@/graphql/product";
import { TICKET_TYPE_EVENT_AVAILABLE_DATA_TYPE } from "@/graphql/type-query/product";
import usePackageStore, {
  PACKAGE_ITEM_DATA_TYPE,
} from "@/store/usePackageStore";
import { EVENT_AVAILABLE_DATA_TYPE } from "@/types/product.type";
import { endOfMonth, format, isSameMonth, set, startOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  data: PACKAGE_ITEM_DATA_TYPE;
  id: string;
};

const VisitDatePicker = ({ data, id }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const { packageList, setPackageList } = usePackageStore();
  const [availableDayList, setAvailableDayList] = useState<
    EVENT_AVAILABLE_DATA_TYPE[]
  >([]);

  const handleClick = () => {
    setOpen(true);
  };
  const onChange = (date: Date) => {
    setValue(date);

    const formattedDay = format(date, "yyyy-MM-dd");

    // ✅ compute event list safely
    let newEventList: EVENT_AVAILABLE_DATA_TYPE[] | undefined;

    if (data.isCapacity && availableDayList.length > 0) {
      newEventList = availableDayList.filter((d) => {
        if (!d.time) return false;

        const apiDate = format(new Date(d.time), "yyyy-MM-dd");
        return apiDate === formattedDay;
      });
    }

    const newPackageList: any = packageList.map((p) => {
      if (p.ticketTypeId !== id) return p;

      return {
        ...p,
        packageItems: p.packageItems.map((item) => {
          if (item.id !== data.id) return item;

          return {
            ...item,
            visitDateSettings: {
              productId: item.id,
              value: formattedDay,
            },
            // ✅ only update if needed
            ...(data.isCapacity && {
              eventList: newEventList ?? [],
            }),
            eventTime: {
              eventId: "",
              eventTime: "",
              id: "",
            },
          };
        }),
      };
    });

    setPackageList(newPackageList ?? packageList);
  };

  const fetchAvailableDates = async (month: Date, id: string) => {
    setLoading(true);
    const today = new Date();

    const dateFrom = isSameMonth(month, today) ? today : startOfMonth(month);

    try {
      const data: TICKET_TYPE_EVENT_AVAILABLE_DATA_TYPE = {
        dateFrom: format(dateFrom, "yyyy-MM-dd"),
        dateTo: format(endOfMonth(month), "yyyy-MM-dd"),
        globalTixTicketTypeID: id,
      };
      const res = await getTicketTypeEventAvailable(data);
      if (res) {
        setAvailableDayList(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (month) {
      fetchAvailableDates(month, data.id);
    }
  }, [month, open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-1">
        <Label htmlFor="visitDate" className="cursor-pointer">
          <p className="text-[#344054] text-sm">Visit Date</p>
        </Label>
        <PopoverAnchor asChild>
          <button
            type="button"
            id="visitDate"
            className="h-11 w-full rounded-md border border-[#D0D5DD] px-[14px] cursor-pointer
                     flex items-center justify-between text-sm"
            onClick={handleClick}
          >
            {data.visitDateSettings?.value !== ""
              ? data.visitDateSettings?.value instanceof Date
                ? data.visitDateSettings.value.toLocaleDateString()
                : data.visitDateSettings?.value
              : "Select Date"}
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          </button>
        </PopoverAnchor>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            month={month}
            onMonthChange={setMonth}
            captionLayout="dropdown"
            fromYear={1900}
            toYear={2035}
            disabled={(day) => {
              if (loading) return true;
              const formattedDay = format(day, "yyyy-MM-dd");

              const isAvailable = availableDayList.some((d) => {
                const apiDate = format(new Date(d.time), "yyyy-MM-dd");
                return apiDate === formattedDay;
              });

              return !isAvailable; // disable if NOT found
            }}
            onSelect={(d) => {
              if (!d) return;
              onChange(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </div>
    </Popover>
  );
};

export default VisitDatePicker;
