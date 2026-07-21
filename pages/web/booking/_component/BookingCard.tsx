import { Button } from "@/components/ui/button";
import {
  BOOKING_STATUS_ENUM,
  BookingFulfillmentStatus,
  BookingSummaryT,
} from "@/types/booking.type";
import { format, parseISO } from "date-fns";
import {
  BedDouble,
  Calendar,
  ChevronRight,
  User,
  Phone,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  Ticket,
} from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { cn, truncateDescription } from "@/lib/utils";
import ImageFallback from "@/components/ImageFallback";
import { HOTEL_IMAGE_PLACEHOLDER, resolveHotelImageUrl } from "@/graphql/hotel";
import { preFixImg } from "@/util/initData";

type Props = {
  data: BookingSummaryT;
};

const FULFILLMENT_ICONS: Record<BookingFulfillmentStatus, ReactNode> = {
  CONFIRMED: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  PENDING: <Clock className="h-4 w-4 text-amber-500" />,
  FAILED: <AlertTriangle className="h-4 w-4 text-rose-500" />,
};

const BookingCard = ({ data }: Props) => {
  const navigate = useNavigate();

  // Helper to determine badge styles based on payment status
  const getStatusStyles = (status: BOOKING_STATUS_ENUM) => {
    switch (status) {
      case BOOKING_STATUS_ENUM.PAID:
        return "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100";
      case BOOKING_STATUS_ENUM.PENDING:
        return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100";
      case BOOKING_STATUS_ENUM.FAILED:
        return "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200";
    }
  };

  const isHotel = data.kind === "HOTEL";

  const thumbSrc = isHotel
    ? resolveHotelImageUrl(data.thumbnail, "240x240") || HOTEL_IMAGE_PLACEHOLDER
    : data.thumbnail
      ? preFixImg(data.thumbnail)
      : HOTEL_IMAGE_PLACEHOLDER;

  const dateLabel = isHotel
    ? data.hotelDetail
      ? `Stay: ${format(parseISO(data.hotelDetail.checkin), "dd MMM yyyy")} – ${format(
          parseISO(data.hotelDetail.checkout),
          "dd MMM yyyy"
        )}`
      : `Check-in: ${format(parseISO(data.relevantDate), "dd MMM yyyy")}`
    : `Visit: ${format(parseISO(data.relevantDate), "dd MMM yyyy")}`;

  const handleManage = () =>
    navigate(
      isHotel
        ? `/bookings/hotel/${data.hotelDetail?.id ?? data.id}`
        : `/bookings/${data.id}`
    );

  return (
    <div className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300">
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        {/* 1. PRODUCT & META DATA (Left) */}
        <div className="flex flex-1 min-w-0 items-center gap-4">
          <div className="hidden sm:block w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-100">
            <ImageFallback
              src={thumbSrc}
              fallbackSrc={HOTEL_IMAGE_PLACEHOLDER}
              alt={data.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            {/* Header: Name + Kind + Status */}
            <div className="flex flex-wrap items-center gap-3">
              <h3
                title={data.title}
                className="text-lg font-bold text-slate-900 truncate"
              >
                {truncateDescription(data.title, 30) || "Booking"}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                  isHotel
                    ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                )}
              >
                {isHotel ? (
                  <BedDouble className="h-3 w-3" />
                ) : (
                  <Ticket className="h-3 w-3" />
                )}
                {data.kind}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                  getStatusStyles(data.paymentStatus)
                )}
              >
                {data.paymentStatus}
              </span>
            </div>

            {/* Meta Info: ID, Date, Ref */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{dateLabel}</span>
              </div>

              {data.referenceNumber && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-xs">REF:</span>
                  <span className="font-mono text-xs">
                    {data.referenceNumber}
                  </span>
                </div>
              )}

              {isHotel && data.hotelDetail?.roomName && (
                <span className="truncate max-w-[220px]">
                  {data.hotelDetail.roomName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. CUSTOMER SNAPSHOT (Middle) */}
        <div className="flex flex-col sm:flex-row gap-6 md:gap-12 lg:gap-16 border-l border-slate-100 pl-0 md:pl-6">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Customer
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate max-w-[120px]">
                {data.customerName || "—"}
              </span>
            </div>
            {data.customerPhone && (
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <Phone className="h-3 w-3 text-slate-400" />
                <span>{data.customerPhone}</span>
              </div>
            )}
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Status
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {FULFILLMENT_ICONS[data.fulfillmentStatus]}
              <span className="text-slate-600 capitalize">
                {data.fulfillmentStatus.toLowerCase()}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Qty: {data.quantity}
            </div>
          </div>
        </div>

        {/* 3. FINANCIALS & ACTIONS (Right) */}
        <div className="flex items-center justify-between md:justify-end gap-6 border-l border-slate-100 pl-0 md:pl-6 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Amount
            </div>
            <div className="text-lg font-bold text-slate-900">
              {Number(data.amount).toLocaleString()}{" "}
              <span className="text-sm font-medium text-slate-500">
                {data.currencyCode}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Purchased: {format(parseISO(data.purchasedAt), "dd MMM yyyy")}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data.ticketDetail?.viewTicketUrl && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-500 hover:text-indigo-600"
                onClick={() =>
                  window.open(data.ticketDetail!.viewTicketUrl, "_blank")
                }
                title="View Ticket URL"
              >
                <Globe className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={handleManage}
              className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200"
            >
              Manage
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
