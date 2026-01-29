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
  Mail,
  Ticket,
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
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case BOOKING_STATUS_ENUM.PENDING:
        return "bg-amber-50 text-amber-700 border-amber-100";
      case BOOKING_STATUS_ENUM.FAILED:
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Header: Order Meta Data */}
      <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-500">Order ID:</span>
            <span className="font-semibold text-slate-900">{data.id}</span>
          </div>
          {data.transactionRefNumber && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500">Ref:</span>
              <span className="font-mono text-slate-700">
                {data.transactionRefNumber}
              </span>
            </div>
          )}
          {data.globaltixTransactionId && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500">GT ID:</span>
              <span className="font-mono text-slate-700">
                {data.globaltixTransactionId}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Purchased: {format(data.transactedTime, "dd MMM yyyy, HH:mm")}</span>
          <span>•</span>
          <span>Paid: {format(data.paidTime, "dd MMM yyyy, HH:mm")}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT COLUMN: Trip & Customer Info (Cols 1-8) */}
          <div className="space-y-6 lg:col-span-8">
            
            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                {data.bookingTickets[0]?.productName || "Product"}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span>
                    Visit:{" "}
                    {data.bookingTickets[0]?.visitDate
                      ? format(data.bookingTickets[0].visitDate, "MMMM dd, yyyy")
                      : "N/A"}
                  </span>
                </div>
                {data.groupName && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-slate-400" />
                    <span>Group: {data.groupName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 gap-6 rounded-lg border border-slate-100 p-4 sm:grid-cols-2 bg-slate-50/30">
              
              {/* Primary Customer */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <User className="h-3 w-3" /> Customer Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-slate-500">Name</p>
                    <p className="font-medium text-slate-900">{data.customerName}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-slate-400" />
                    <div>
                      <p className="text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">{data.email}</p>
                      {data.alternateEmail && (
                        <p className="text-xs text-slate-500">Alt: {data.alternateEmail}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-slate-400" />
                    <div>
                      <p className="text-slate-500">Phone</p>
                      <p className="font-medium text-slate-900">
                        {data.mobilePrefix} {data.mobileNumber}
                      </p>
                    </div>
                  </div>
                  {data.passportNumber && (
                    <div>
                      <p className="text-slate-500">Passport</p>
                      <p className="font-medium text-slate-900">{data.passportNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <User className="h-3 w-3" /> Guest Details
                </h4>
                <div className="space-y-2 text-sm">
                  {data.guestName && (
                    <div>
                      <p className="text-slate-500">Name</p>
                      <p className="font-medium text-slate-900">{data.guestName}</p>
                    </div>
                  )}
                  {data.guestEmail && (
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-slate-400" />
                      <div>
                        <p className="text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">{data.guestEmail}</p>
                      </div>
                    </div>
                  )}
                  {data.guestPhone && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-0.5 text-slate-400" />
                      <div>
                        <p className="text-slate-500">Phone</p>
                        <p className="font-medium text-slate-900">{data.guestPhone}</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-slate-500">Members in Group</p>
                    <p className="font-medium text-slate-900">{data.membersInGroup}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks */}
            {data.remarks && (
              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 border border-amber-100">
                <span className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Remarks:
                </span>
                <p className="mt-1 whitespace-pre-wrap">{data.remarks}</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Financials & Status (Cols 9-12) */}
          <div className="flex flex-col gap-6 lg:col-span-4 border-l border-slate-100 lg:pl-6 pt-6 lg:pt-0">
            
            {/* Price & Status */}
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                <div className="mb-2 text-xs font-semibold uppercase text-slate-500">
                  Transaction Summary
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  THB {data.transactedAmount.toLocaleString()}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide",
                      getStatusStyles(data.status)
                    )}
                  >
                    {data.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-medium text-slate-900">{data.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transacted By</span>
                  <span className="font-medium text-slate-900">{data.transactedBy}</span>
                </div>
                {data.paymentDetail && (
                  <div className="mt-2">
                    <span className="text-slate-500 block text-xs mb-1">Payment Detail</span>
                    <div className="rounded bg-slate-100 p-2 text-xs font-mono text-slate-600 break-all">
                      {typeof data.paymentDetail === "object"
                        ? JSON.stringify(data.paymentDetail)
                        : String(data.paymentDetail)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Flags */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase text-slate-500">Ticket Status</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 flex items-center gap-2">
                    {data.isTicketReady ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-500" />
                    )}
                    Ticket Ready
                  </span>
                  <span className="font-medium">{data.isTicketReady ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 flex items-center gap-2">
                    {data.isTicketConfirmed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                    )}
                    Ticket Confirmed
                  </span>
                  <span className="font-medium">{data.isTicketConfirmed ? "Yes" : "No"}</span>
                </div>
                {data.requiresManualConfirm && (
                  <div className="flex items-center justify-between text-sm text-amber-700 bg-amber-50 px-2 py-1 rounded">
                    <span className="flex items-center gap-2 font-semibold">
                      <AlertTriangle className="h-4 w-4" />
                      Manual Confirm
                    </span>
                    <span>Required</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto">
               {data.viewTicketUrl && (
                <Button 
                  variant="outline" 
                  className="w-full gap-2 justify-start"
                  onClick={() => window.open(data.viewTicketUrl, '_blank')}
                >
                  <Globe className="h-4 w-4" /> View Ticket URL
                </Button>
              )}
              {data.eTicketUrl && (
                <Button 
                  variant="outline" 
                  className="w-full gap-2 justify-start"
                  onClick={() => window.open(data.eTicketUrl, '_blank')}
                >
                  <Ticket className="h-4 w-4" /> Download E-Ticket
                </Button>
              )}
              <Button
                onClick={() => navigate(`/cart/preview/${data.id}`)}
                className="w-full gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Manage Booking
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tickets Breakdown Section */}
        {data.bookingTickets && data.bookingTickets.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Booked Tickets ({data.bookingTickets.length})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-2 rounded-l-lg">Product Name</th>
                    <th className="px-4 py-2">Visit Date</th>
                    <th className="px-4 py-2">Type / Option</th>
                    {/* Assuming quantity is relevant here based on membersInGroup or ticket count */}
                    <th className="px-4 py-2 rounded-r-lg text-right">Pax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.bookingTickets.map((ticket, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {ticket.productName}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {ticket.visitDate 
                          ? format(ticket.visitDate, "dd MMM yyyy") 
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {/* Mapping generic ticket fields. Adjust property names if different */}
                        {ticket.productOptionName || "Standard Entry"} 
                      </td>
                      <td className="px-4 py-3 text-right text-slate-900">
                        {ticket.quantity || 1}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;