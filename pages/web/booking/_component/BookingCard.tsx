import { Button } from "@/components/ui/button";
import {
  BOOKING_STATUS_ENUM,
  MY_BOOKING_DATA_TYPE,
} from "@/types/booking.type";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  data: MY_BOOKING_DATA_TYPE;
};

const BookingCard = ({ data }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-6 border border-[#D9D9D9] rounded-2xl flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
        <div
          className={`col-span-1 ${
            data.status === BOOKING_STATUS_ENUM.PAID
              ? "lg:col-span-3"
              : "lg:col-span-2"
          }`}
        >
          <div className="flex items-center gap-2">
            <p> Order ID</p>
            <p className="text-indigo-700">{data.id}</p>
          </div>
          <p className="mt-2">
            Purchased on {format(data.transactedTime, "dd MMMM yyyy")}
          </p>
        </div>
        {/* {data.status === BOOKING_STATUS_ENUM.PAID && (
          <div className="flex items-center">
            <Clock className="text-indigo-700 w-5 h-5" />
          </div>
        )} */}
        <div
          className={`flex items-center justify-end gap-4 ${
            data.status === BOOKING_STATUS_ENUM.PENDING
              ? "col-span-2"
              : "col-span-1"
          }`}
        >
          {/* {data.status === BOOKING_STATUS_ENUM.PENDING && (
            <Button>Pay Now</Button>
          )} */}
          <Button
            onClick={() => {
              navigate(`/cart/preview/${data.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center p-4 gap-2 bg-[#FAFCFB] border border-[#D9D9D9] rounded-[12px]">
        <div className="flex flex-col flex-1 gap-2 lg:gap-3">
          <div className="flex items-center gap-3">
            <p className="text-lg max-w-54.25 line-clamp-1">
              {data.bookingTickets[0].productName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-700" />
            <p className="text-indigo-700">
              {format(data.bookingTickets[0].visitDate, "MMMM dd, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-full lg:w-auto lg:flex-col lg:items-end gap-1">
          <div className="flex items-center gap-1">
            <p className=" text-gray-300 text-lg">Qty:</p>
            <p className=" text-indigo-700 text-lg">
              {data.bookingTickets.length.toString()}
            </p>
          </div>
          <p
            className={`px-3 py-1 rounded-[8px] text-sm  ${
              data.status === BOOKING_STATUS_ENUM.PENDING
                ? "text-[#696418] bg-[#FDFAC2]"
                : data.status === BOOKING_STATUS_ENUM.PAID
                ? "bg-indigo-100 text-indigo-700"
                : "bg-[#FBE8E9] text-red"
            } `}
          >
            {data.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
