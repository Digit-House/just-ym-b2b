import { Button } from "@/components/ui/button";
import {
  BOOKING_STATUS_ENUM,
  MY_BOOKING_DATA_TYPE,
} from "@/types/booking.type";
import { format } from "date-fns";
import { Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils"; // Assuming you have a utils file for cn(), if not, use clsx or standard classnames

type Props = {
  data: MY_BOOKING_DATA_TYPE;
};

const BookingCard = ({ data }: Props) => {
  const navigate = useNavigate();

  // Helper to determine badge styles based on status
  const getStatusStyles = (status: BOOKING_STATUS_ENUM) => {
    switch (status) {
      case BOOKING_STATUS_ENUM.PAID:
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case BOOKING_STATUS_ENUM.PENDING:
        return "bg-amber-50 text-amber-700 border-amber-100";
      case BOOKING_STATUS_ENUM.FAILED: // Assuming you might have this based on your previous colors
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200">
      {/* Header: Order Meta Data */}
      <div className="flex flex-col gap-1 border-b border-slate-100 bg-slate-50/50 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-500">Order ID:</span>
          <span className="font-semibold text-slate-900">{data.id}</span>
        </div>
        <div className="text-xs text-slate-500">
          Purchased on {format(data.transactedTime, "dd MMMM yyyy")}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          
          {/* Left Side: Product Info */}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div>
              <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900">
                {data.bookingTickets[0].productName}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span className="font-medium">
                  {format(data.bookingTickets[0].visitDate, "MMMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Actions & Meta */}
          <div className="flex items-center justify-between gap-4 md:flex-col md:items-end border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
            
            {/* Quantity & Status */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Quantity
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {data.bookingTickets.length}
                </span>
              </div>
              
              <div
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide",
                  getStatusStyles(data.status)
                )}
              >
                {data.status}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => navigate(`/cart/preview/${data.id}`)}
              variant="outline"
              className="h-9 w-full gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 md:w-auto"
            >
              View Details
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;