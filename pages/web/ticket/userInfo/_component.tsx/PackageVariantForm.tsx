"use client";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePackageStore, {
  PACKAGE_ITEM_DATA_TYPE,
} from "@/store/usePackageStore";
import { ProductOptionQuestionT } from "@/types/product.type";
import { addYears, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  name: string;
  id: string;
  guestIndex: number;
  item: PACKAGE_ITEM_DATA_TYPE;
};

const strip = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const PackageVariantForm = ({ name, id, guestIndex, item }: Props) => {
  const { packageList, setPackageList } = usePackageStore();

  const today = new Date();

  const [open, setOpen] = useState(false);

  const [minDate, setMinDate] = useState<Date | null>(today);
  const [maxDate, setMaxDate] = useState<Date | null>(today);

  useEffect(() => {
    if (item.ageFrom == null || item.ageTo == null) {
      setMinDate(null);
      setMaxDate(null);
      return;
    }
    const minAge = Math.min(item.ageFrom, item.ageTo);
    const maxAge = Math.max(item.ageFrom, item.ageTo);

    // earliest allowed birthdate (oldest person) = today - maxAge
    const earliest = strip(addYears(today, -maxAge));
    // latest allowed birthdate (youngest person) = today - minAge
    const latest = strip(addYears(today, -minAge));

    setMinDate(earliest);
    setMaxDate(latest);
  }, []);

  const handleAnswerChange = (
    question: ProductOptionQuestionT,
    value: string | number
  ) => {
    const newPackageList: any = packageList.map((p) => {
      if (p.ticketTypeId !== id) return p;
      return {
        ...p,
        packageItems: p.packageItems.map((pItem) => {
          if (pItem.id !== item.id) return pItem;
          return {
            ...pItem,
            questionList: pItem.questionList.map((group, groupIndex) => {
              if (groupIndex !== guestIndex) return group;
              if (!Array.isArray(group)) return group; // safety
              return group.map((q) => {
                if (q.id !== question.globaltixId) return q;
                return {
                  ...q,
                  answer: value,
                };
              });
            }),
          };
        }),
      };
    });
    setPackageList(newPackageList);
  };

  const getLabelFromKey = (key: string | number, optionList: any[]) => {
    return (
      optionList.find((opt) => String(opt.key) === String(key))?.value || ""
    );
  };

  return (
    <div className="border border-[#E2E8F0] rounded-[10px] flex flex-col overflow-hidden">
      <p className="px-4 py-2 text-[#0F172B] capitalize bg-indigo-200">
        {name.toLocaleLowerCase()} {guestIndex + 1} Information
      </p>
      <div className="flex flex-col gap-3 px-4 py-2">
        {item.questions.map((q, index) => (
          <div key={q.id + index}>
            {q.type === "OPTION" && (
              <div className="flex flex-col gap-[6px]">
                <p className="text-sm text-[#344054]">{q.question}</p>
                <Select
                  value={item.questionList[guestIndex][index]?.answer || ""}
                  onValueChange={(value: string | number) => {
                    handleAnswerChange(q, value);
                  }}
                >
                  <SelectTrigger className="w-full min-h-11 border border-gray-300">
                    <SelectValue placeholder="Select option">
                      {getLabelFromKey(
                        item.questionList?.[guestIndex]?.[index]?.answer,
                        q.optionList
                      ) || "Select option"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {q.optionList.map((option: any) => (
                        <SelectItem key={option.key} value={String(option.key)}>
                          {option.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {q.type === "DATE" && (
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-[#344054]">{q.question}</p>
                <Popover open={open} onOpenChange={setOpen} modal={false}>
                  <PopoverTrigger asChild>
                    <button className="h-11 cursor-pointer rounded-md shadow-xs text-base md:text-sm flex justify-between items-center border-[#D0D5DD] px-[14px] border">
                      {item.questionList[guestIndex][index]?.answer ||
                        "Select date"}
                      <CalendarIcon className="w-5 h-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 overflow-hidden"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={
                        item.questionList[guestIndex][index]?.answer as any
                      }
                      captionLayout="dropdown"
                      fromYear={minDate ? minDate.getFullYear() : 1900}
                      toYear={maxDate ? maxDate.getFullYear() : 2100}
                      disabled={(d) => {
                        if (!d) return true;

                        const dd = strip(d);

                        // If no restrictions → allow all dates
                        if (!minDate && !maxDate) return false;

                        if (minDate && dd < strip(minDate)) return true;
                        if (maxDate && dd > strip(maxDate)) return true;

                        return false;
                      }}
                      onSelect={(date) => {
                        if (date) {
                          handleAnswerChange(q, format(date, "yyyy-MM-dd"));
                          setOpen(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {q.type === "FREETEXT" && (
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-[#344054]">{q.question}</p>
                <Input
                  value={item.questionList[guestIndex][index]?.answer || ""}
                  onChange={(e) => handleAnswerChange(q, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageVariantForm;
