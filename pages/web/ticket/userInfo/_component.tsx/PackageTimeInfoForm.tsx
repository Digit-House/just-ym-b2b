"use client";

import usePackageStore, {
  EVENT_DATA_TYPE,
  PACKAGE_ITEM_DATA_TYPE,
} from "@/store/usePackageStore";
import React, { useState } from "react";
import { EVENT_AVAILABLE_DATA_TYPE } from "@/types/product.type";
import { CheckIcon, Sunrise } from "lucide-react";
import { formatDate } from "date-fns";
import VisitDatePicker from "./VisitDatePicker";

type Props = {
  data: PACKAGE_ITEM_DATA_TYPE;
  id: string;
};

const PackageTimeInfoFrom = ({ data, id }: Props) => {
  const { packageList, setPackageList } = usePackageStore();

  const getTimePeriod = (timeString: string) => {
    const date = new Date(timeString);
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
  };
  const handleSelectedEvent = (item: EVENT_AVAILABLE_DATA_TYPE) => {
    const newPackageList: any = packageList.map((p: any) => {
      if (p.ticketTypeId === id) {
        return {
          ...p,
          packageItems: p.packageItems.map((pItem: any) => {
            if (pItem.id === data.id) {
              console.log(pItem, "pItem");
              return {
                ...pItem,
                eventTime:
                  pItem.eventTime?.eventId === item.id
                    ? {
                        eventId: "",
                        eventTime: "",
                        id: "",
                      }
                    : {
                        eventId: item.id,
                        eventTime: item.time,
                        id: pItem.id,
                      },
              };
            } else {
              return pItem;
            }
          }),
        };
      } else {
        return p;
      }
    });
    setPackageList(newPackageList);
  };

  return (
    <div className="border border-[#E2E8F0] rounded-[10px] overflow-hidden flex flex-col">
      <p className="bg-indigo-200 px-4 py-2 text-[#0F172B]">
        Choose Pickup Time
      </p>
      <div className="px-4 py-2 flex flex-col gap-3 divide-y divide-[#D9D9D9]">
        <div className="pb-3">
          <VisitDatePicker data={data} id={id} />
        </div>
        {data.isCapacity && data.eventList.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-[#0F172B] text-sm">
              Select your preferred time slot.
            </p>
            <div className="grid w-full grid-cols-2 gap-4">
              {data.eventList.map((item) => (
                <div
                  key={item.id}
                  className={`w-full border-2 p-5 rounded-2xl cursor-pointer flex justify-between gap-4 ${
                    item.id === data.eventTime?.eventId
                      ? "border-indigo-700 bg-indigo-100"
                      : "border-[#E2E8F0] bg-transparent"
                  }`}
                  onClick={() => {
                    handleSelectedEvent(item);
                  }}
                >
                  <div className="flex flex-col gap-2 lg:gap-4 lg:flex-row">
                    <div
                      className={`w-8 h-8 flex justify-center items-center rounded-[14px] ${
                        item.id === data.eventTime?.eventId
                          ? "bg-indigo-700"
                          : "bg-[#F1F5F9]"
                      }`}
                    >
                      <Sunrise
                        className={`w-4 h-4 ${
                          data.eventTime?.eventId === item.id
                            ? "text-white"
                            : "text-[#45556C]"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p
                        className={`${
                          data.eventTime?.eventId === item.id
                            ? "text-indigo-700"
                            : "text-[#62748E]"
                        }`}
                      >
                        {getTimePeriod(item.time)}
                      </p>
                      <p className="text-[#0F172B]">
                        {" "}
                        {formatDate(item.time, "hh:mm a")}{" "}
                      </p>
                    </div>
                  </div>
                  {data.eventTime?.eventId === item.id && (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-700">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageTimeInfoFrom;
