import React, { useEffect, useMemo, useState } from "react";
import { addYears, format, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { CART_ICON_ENUM, GuestInfoT } from "@/types/product.type";
import { useCartStore } from "@/store/useCartStore";
import PreviewFormFrame from "./PreviewFormFrame";
import { Button } from "@/components/ui/button";

type Props = {
  guestInfo: GuestInfoT;
  step: number;
  currentOpen: number;
  setCurrentOpen: React.Dispatch<React.SetStateAction<number>>;
};

const strip = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const PreviewGuestForm = ({
  guestInfo,
  step,
  currentOpen,
  setCurrentOpen,
}: Props) => {
  const { answerList, finalPackage, setAnswerList, guestList, setGuestList } =
    useCartStore();

  const today = useMemo(() => strip(new Date()), []);  
  const [open, setOpen] = useState(false);
  const [dateOpenMap, setDateOpenMap] = useState<Record<number, boolean>>({});
  const [userAnswerList, setUserAnswerList] = useState<any[]>([]);
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>();

  /* ---------------- Load answers ---------------- */
  useEffect(() => {
    if (!guestInfo) return;
    const newAnswerList: any =
      answerList[guestInfo.ticketIndex].questionList[guestInfo.guestIndex];
    setUserAnswerList(newAnswerList);
  }, [guestInfo]);

  /* ---------------- Calculate DOB range ---------------- */
  useEffect(() => {
    if (guestInfo.ticket.ageFrom == null && guestInfo.ticket.ageTo == null) {
      setMinDate(null);
      setMaxDate(null);
      return;
    }

    // const minAge = Math.min(guestInfo.ticket.ageFrom, guestInfo.ticket.ageTo);
    // const maxAge = Math.max(guestInfo.ticket.ageFrom, guestInfo.ticket.ageTo);
    // console.log(minAge, maxAge);
    // // oldest allowed DOB
    // const earliest = strip(addYears(today, -maxAge));
    // // youngest allowed DOB
    // const latest = strip(addYears(today, -minAge));

    // setMinDate(earliest);
    // setMaxDate(latest);
    //✅ start calendar at valid month
    setCalendarMonth(today);
  }, [guestInfo]);

  /* ---------------- Open section ---------------- */
  useEffect(() => {
    if (currentOpen === step) {
      setOpen(true);
    }
  }, [currentOpen, step]);

  /* ---------------- Handlers ---------------- */
  const handleAnswerChange = (index: number, value: string | number) => {
    setUserAnswerList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, answer: value } : item))
    );
  };

  const disableCheck = () => userAnswerList.some((item) => item.answer === "");

  const handleConfirm = () => {
    const newAnswerList: any = answerList.map((ticket, tIndex) => {
      if (tIndex !== guestInfo.ticketIndex) return ticket;
      return {
        ...ticket,
        questionList: ticket.questionList.map((guest, gIndex) =>
          gIndex === guestInfo.guestIndex ? userAnswerList : guest
        ),
      };
    });

    setGuestList(
      guestList.map((g) =>
        g.ticketIndex === guestInfo.ticketIndex &&
        g.guestIndex === guestInfo.guestIndex
          ? { ...g, isFilled: true }
          : g
      )
    );

    setAnswerList(newAnswerList);
    setOpen(false);
    setCurrentOpen((v) => v + 1);
  };

  const setDateOpen = (i: number, val: boolean) =>
    setDateOpenMap((prev) => ({ ...prev, [i]: val }));

  /* ---------------- Render ---------------- */
  return (
    <PreviewFormFrame
      title={`${guestInfo.ticket.name} ${guestInfo.guestIndex + 1} Information`}
      iconName={CART_ICON_ENUM.GUEST}
      open={open}
      setOpen={setOpen}
    >
      <div className="flex flex-col w-full gap-5 px-8 py-4">
        {finalPackage?.questions.map((item, i) => {
        
          /* ---- DATE helpers ---- */
          const selectedDate = userAnswerList[i]?.answer
            ? parseISO(userAnswerList[i].answer)
            : undefined;
          return (
            <div key={item.id + i} className="w-full">
              {/* OPTION */}
              {item.type === "OPTION" && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm text-[#344054]">{item.question}</p>
                  <Select
                    value={userAnswerList[i]?.answer || ""}
                    onValueChange={(v) => handleAnswerChange(i, v)}
                  >
                    <SelectTrigger className="w-full min-h-11 border border-gray-300">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {item.optionList.map((q: any) => (
                          <SelectItem key={q.key} value={q.value}>
                            {q.value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* DATE */}
              {item.type === "DATE" && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm text-[#344054]">{item.question}</p>

                  <Popover 
                  open={!!dateOpenMap[i]}
                  onOpenChange={(val) => setDateOpen(i, val)}
                  >
                    <PopoverTrigger asChild>
                      <button className="h-11 w-full rounded-md border px-3 flex justify-between items-center">
                        {userAnswerList[i]?.answer || "Select date"}
                        <CalendarIcon className="w-5 h-5" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        captionLayout="dropdown"
                        startMonth={minDate ?? undefined}
                        endMonth={maxDate ?? undefined}
                        // disabled={(d) => {
                        //   const dd = strip(d);
                        //   if (minDate && dd < strip(minDate)) return true;
                        //   if (maxDate && dd > strip(maxDate)) return true;
                        //   return false;
                        // }}
                        onSelect={(date) => {
                          if (!date) return;
                          handleAnswerChange(i, format(date, "yyyy-MM-dd"));
                          setDateOpen(i, false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* FREETEXT */}
              {item.type === "FREETEXT" && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm text-[#344054]">{item.question}</p>
                  <Input
                    value={userAnswerList[i]?.answer || ""}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}

        <Button
          type="button"
          size="lg"
          disabled={disableCheck()}
          onClick={handleConfirm}
        >
          Confirm Information
        </Button>
      </div>
    </PreviewFormFrame>
  );
};

export default PreviewGuestForm;
