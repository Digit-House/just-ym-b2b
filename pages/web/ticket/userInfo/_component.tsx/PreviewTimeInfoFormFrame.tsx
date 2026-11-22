import React, { useEffect, useState } from "react";
import {
  CART_ICON_ENUM,
  EVENT_AVAILABLE_DATA_TYPE,
} from "@/types/product.type";
import { CheckIcon, Sunrise } from "lucide-react";
import { formatDate } from "date-fns";
import { useCartStore } from "@/store/useCartStore";
import PreviewFormFrame from "./PreviewFormFrame";
import { Button } from "@/components/ui/button";
import { isLowStock, isSoldOut, seatsLeft } from "@/lib/slotStock";

type Props = {
  setTimeInfoCheck: React.Dispatch<React.SetStateAction<boolean>>;
  currentOpen: number;
  setCurrentOpen: React.Dispatch<React.SetStateAction<number>>;
};

const PreviewTimeInfoForm = ({
  setTimeInfoCheck,
  currentOpen,
  setCurrentOpen,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [currentConfirm, setCurrentConfirm] =
    useState<EVENT_AVAILABLE_DATA_TYPE | null>(null);
  const { eventList, answerList, setAnswerList } = useCartStore();

  const getTimePeriod = (timeString: string) => {
    const date = new Date(timeString);
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
  };

  const totalQty = answerList.reduce(
    (sum: number, a: any) => sum + (a.quantity || 0),
    0
  );
  const isDisabled = (item: EVENT_AVAILABLE_DATA_TYPE) => {
    const left = seatsLeft(item);
    return isSoldOut(item) || (left !== null && left < totalQty);
  };

  const handleSelectedEvent = (item: EVENT_AVAILABLE_DATA_TYPE) => {
    if (isDisabled(item)) return;
    if (currentConfirm?.id === item.id) {
      setCurrentConfirm(null);
      return;
    }
    setCurrentConfirm(item);
  };

  const handleConfirm = () => {
    if (!currentConfirm) return;
    const newAnswerList = answerList.map((data: any) => ({
      ...data,
      eventId: currentConfirm.id,
      eventTime: currentConfirm.time,
    }));
    setAnswerList(newAnswerList);
    setTimeInfoCheck(true);
    setOpen(false);
    setCurrentOpen(3);
  };

  useEffect(() => {
    if (currentOpen === 2) {
      setOpen(true);
    }
  }, [currentOpen]);

  return (
    <PreviewFormFrame
      title="Choose Pickup Time"
      open={open}
      setOpen={setOpen}
      iconName={CART_ICON_ENUM.TIME}
    >
      <div className="flex flex-col items-start w-full gap-5 px-8 py-4">
        {eventList.length > 0 && (
          <div className="grid w-full grid-cols-2 gap-4">
            {eventList.map((item) => (
              <div
                key={item.id}
                aria-disabled={isDisabled(item)}
                className={`w-full border-2 p-5 rounded-2xl flex justify-between gap-4 ${
                  isDisabled(item)
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } ${
                  item.id === currentConfirm?.id
                    ? "border-indigo-700 bg-indigo-100"
                    : "border-[#E2E8F0] bg-transparent"
                }`}
                onClick={() => {
                  handleSelectedEvent(item);
                }}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-8 h-8 flex justify-center items-center rounded-[14px] ${
                      item.id === currentConfirm?.id
                        ? "bg-indigo-700"
                        : "bg-[#F1F5F9]"
                    }`}
                  >
                    <Sunrise
                      className={`w-4 h-4 ${
                        currentConfirm?.id === item.id
                          ? "text-white"
                          : "text-[#45556C]"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p
                      className={`text-base ${
                        currentConfirm?.id === item.id
                          ? "text-indigo-700"
                          : "text-[#62748E]"
                      }`}
                    >
                      {getTimePeriod(item.time)}
                    </p>
                    <p className="">{formatDate(item.time, "hh:mm a")}</p>
                    {isSoldOut(item) ? (
                      <p className="text-sm font-semibold text-red-600">Sold out</p>
                    ) : isDisabled(item) ? (
                      <p className="text-sm font-semibold text-amber-600">
                        Only {seatsLeft(item)} left
                      </p>
                    ) : isLowStock(item) ? (
                      <p className="text-sm font-semibold text-amber-600">
                        {seatsLeft(item)} left
                      </p>
                    ) : null}
                  </div>
                </div>
                {currentConfirm?.id === item.id && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-700">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Button
          type="button"
          disabled={!currentConfirm}
          onClick={handleConfirm}
          size="lg"
        >
          Confirm Information
        </Button>
      </div>
    </PreviewFormFrame>
  );
};

export default PreviewTimeInfoForm;
