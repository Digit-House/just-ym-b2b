import { Button } from "@/components/ui/button";
import {
  BOOKING_STATUS_ENUM,
  MY_BOOKING_DATA_TYPE,
} from "@/types/booking.type";
import { format } from "date-fns";
import {
  Calendar,
  ChevronRight,
  User,
  Phone,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type Props = {
  data: MY_BOOKING_DATA_TYPE;
};

const BookingCard = ({ data }: Props) => {
  const navigate = useNavigate();

  // Helper to determine badge styles based on status
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

  const mainTicket = data.bookingTickets[0];

  return (
    <div className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300">
      {/* MAIN ROW: Table-Style Layout */}
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        {/* 1. PRODUCT & META DATA (Left) */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header: Name + Status */}
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {mainTicket.productName || "Product"}
            </h3>
            {/* Status Badge - Prominent */}
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                getStatusStyles(data.status)
              )}
            >
              {data.status}
            </span>
          </div>

          {/* Meta Info: ID, Date, Ref */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <div className="flex items-center gap-1.5 font-medium text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              <span className="text-slate-400 font-normal text-xs mr-1">
                ID:
              </span>
              {data.id}
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Visit:{" "}
                {mainTicket?.visitDate
                  ? format(mainTicket.visitDate, "dd MMM yyyy")
                  : "N/A"}
              </span>
            </div>

            {data.transactionRefNumber && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-xs">REF:</span>
                <span className="font-mono text-xs">
                  {data.transactionRefNumber}
                </span>
              </div>
            )}
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
                {data.customerName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <Phone className="h-3 w-3 text-slate-400" />
              <span>
                {data.mobilePrefix} {data.mobileNumber}
              </span>
            </div>
          </div>

          {/* Ticket Ready Flags */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Status
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5" title="Ticket Ready">
                {data.isTicketReady ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-slate-600">Ready</span>
              </div>
              <div
                className="flex items-center gap-1.5"
                title="Ticket Confirmed"
              >
                {data.isTicketConfirmed ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                )}
                <span className="text-slate-600">Confirmed</span>
              </div>
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
              {data.transactedAmount.toLocaleString()}{" "}
              <span className="text-sm font-medium text-slate-500">THB</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Transacted Time : {format(data.transactedTime, "dd MMM yyyy")}
            </div>
            {/* <div className="text-[10px] text-slate-400 mt-0.5">
              Paid Time : {format(data.paidTime, "dd MMM yyyy")}
            </div> */}
          </div>

          <div className="flex items-center gap-2">
            {data.viewTicketUrl && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-500 hover:text-indigo-600"
                onClick={() => window.open(data.viewTicketUrl, "_blank")}
                title="View Ticket URL"
              >
                <Globe className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={() => navigate(`/cart/preview/${data.id}`)}
              className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200"
            >
              Manage
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* EXPANDABLE / DETAILS SECTION */}
      <div className="border-t border-slate-100 bg-slate-50/30">
        {data.remarks && (
          <div className="px-6 py-3 border-b border-slate-100 bg-amber-50/50 flex items-start gap-3">
            <FileText className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-amber-800">Remarks:</span>
              <span className="text-amber-900 ml-2">{data.remarks}</span>
            </div>
          </div>
        )}

        {/* Tickets Breakdown Table */}
        {/* {data.bookingTickets && data.bookingTickets.length > 0 && (
          <div className="p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Ticket className="h-3.5 w-3.5" />
              Booked Tickets ({data.bookingTickets.length})
            </h4>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm text-left bg-white">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold text-xs">
                      Product Name
                    </th>
                    <th className="px-4 py-2.5 font-semibold text-xs">
                      Visit Date
                    </th>
                    <th className="px-4 py-2.5 font-semibold text-xs">
                      Option
                    </th>
                    <th className="px-4 py-2.5 font-semibold text-xs text-right">
                      Pax
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.bookingTickets.map((ticket, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {ticket.productName}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {ticket.visitDate
                          ? format(ticket.visitDate, "dd MMM yyyy (EEE)")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          {ticket.productOptionName || "Standard"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        {ticket.quantity || 1}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
              <div>
                <span className="block font-semibold text-slate-700 mb-1">
                  Payment Method
                </span>
                <span>
                  {data.paymentMethod} ({data.transactedBy})
                </span>
              </div>
              {data.eTicketUrl && (
                <div className="sm:text-right">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-indigo-600 hover:text-indigo-700"
                    onClick={() => window.open(data.eTicketUrl, "_blank")}
                  >
                    Download E-Ticket PDF <Ticket className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default BookingCard;
