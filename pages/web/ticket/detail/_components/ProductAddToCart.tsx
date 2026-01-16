import { SelectedProductOptionT, TicketTypeT } from "@/types/product.type";
import { Calendar, TicketIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  pickedDate: Date;
  selectedProductOption: SelectedProductOptionT | null;
  eventLoading: boolean;
};

const ProductAddToCart = ({
  title,
  pickedDate,
  selectedProductOption,
  eventLoading,
}: Props) => {
  const {
    finalPackage,
    setFinalPackage,
    answerList,
    setAnswerList,
    setGuestList,
    setStep,
    setVariantStep,
  } = useCartStore();
  const [variant, setVariant] = useState<TicketTypeT[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedProductOption) return;
    setVariant(
      selectedProductOption.ticketType.filter(
        (item: TicketTypeT) => item.quantity > 0
      )
    );
  }, [selectedProductOption?.ticketType]);

  useEffect(() => {
    if (!selectedProductOption) return;

    const newAnswerList = selectedProductOption.ticketType.map((data) => ({
      cartItemId: null,
      eventId: null,
      eventTime: null,
      quantity: data.quantity,
      questionList: Array.from({ length: data.quantity || 0 }, () =>
        selectedProductOption.questions.map((question) => ({
          answer: "",
          id: question.globaltixId,
        }))
      ),
      ticketTypeId: data.id,
      visitDate: format(pickedDate, "yyyy-MM-dd"),
    }));
    const filterNewAnswerList: any = newAnswerList.filter(
      (data: any) => data.quantity > 0
    );

    const newPackage = {
      ...selectedProductOption,
      ticketType: selectedProductOption.ticketType.filter(
        (data: any) => data.quantity > 0
      ),
    };
    setFinalPackage(newPackage);

    setAnswerList(filterNewAnswerList);
  }, [selectedProductOption]);

  const guestList = () => {
    if (!finalPackage) return [];
    const list: {
      ticket: TicketTypeT;
      guestIndex: number;
      ticketIndex: number;
      isFilled: boolean;
    }[] = [];

    finalPackage.ticketType.forEach((ticket, tIndex) => {
      for (let i = 0; i < ticket.quantity; i++) {
        list.push({
          ticket,
          guestIndex: i,
          ticketIndex: tIndex,
          isFilled: false,
        });
      }
    });
    setGuestList(list);
  };

  const handleAdded = () => {
    if (!finalPackage) return;
    if (finalPackage.isCapacity || finalPackage.questions.length > 0) {
      guestList();
      setVariantStep(1);
      setStep(1);
      navigate("/tickets/user-info");
    } else {
      // setOpen(true);
      setStep(1);
      navigate("/tickets/user-info");
    }
  };
  return (
    <div
      className="w-full px-4 py-6 rounded-2xl border border-[#d9d9d9]"
      style={{
        boxShadow: "4px 4px 30px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      <h4 className="text-lg">{title}</h4>
      <div className="py-4 divide-y divide-[#D9D9D9]">
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex items-center justify-between gap-4">
            {selectedProductOption && (
              <div className="flex items-center gap-3">
                <TicketIcon />
                {/* <Typo
                  text={selectedProductOption.name}
                  size="sm"
                  className="text-black"
                /> */}
                <p className="text-sm">{selectedProductOption.name}</p>
              </div>
            )}

            {/* <button className="transition-all duration-300 cursor-pointer text-primary hover:text-primary/80">
              <Typo text="Edit" fontWeight="bold" size="sm" />
            </button> */}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar />
              {/* <Typo
                text={format(pickedDate, "EEE, MMM d yyyy")}
                size="sm"
                className="text-black"
              /> */}
              <p className="text-sm">{format(pickedDate, "EEE, MMM d yyyy")}</p>
            </div>
            {/* <button className="transition-all duration-300 cursor-pointer text-primary hover:text-primary/80">
              <Typo text="Edit" fontWeight="bold" size="sm" />
            </button> */}
          </div>
        </div>

        {selectedProductOption && variant.length > 0 && (
          <div className="flex flex-col gap-4 py-4">
            {variant.map((item: TicketTypeT) => (
              <div
                className="flex items-center justify-between gap-4"
                key={item.name}
              >
                <p className="text-sm">
                  {item.quantity}x {item.name}
                </p>
                <p className="text-sm font-bold text-indigo-700">
                  ฿${(item.dhNetPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}

        {selectedProductOption && (
          <div className="flex items-center justify-between pt-4">
            <p className=" font-bold">Total Payment</p>
            <p className="text-sm text-indigo-700 font-bold">
              ฿{selectedProductOption.totalPrice.toFixed(2)}
            </p>
          </div>
        )}
      </div>
      {selectedProductOption &&
        selectedProductOption.ticketType.length > 0 &&
        selectedProductOption.totalPrice > 0 && (
          <div className="flex flex-col gap-4">
            <Button
              disabled={eventLoading}
              onClick={handleAdded}
              className="w-full py-3 font-normal disabled:cursor-not-allowed"
            >
              Add to Cart
            </Button>
            {/* <Button
            text="Add to Cart"
            className="w-full !font-normal disabled:cursor-not-allowed py-3"
            disable={!selectedPackage || selectedPackage?.totalPrice <= 0}
          /> */}

            {/* <Button
            variant="secondary"
            text="Add to Cart"
            className="w-full !font-normal disabled:cursor-not-allowed py-3  !text-primary"
            disable={!selectedPackage || selectedPackage?.totalPrice <= 0}
          /> */}
          </div>
        )}
    </div>
  );
};

export default ProductAddToCart;
