import { useParams } from "react-router-dom";
import { usePreview } from "./usePreview";
import PageContainer from "@/components/PageContainer";
import BackBtn from "@/components/BackBtn";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getErrMsg, preFixImg } from "@/util/initData";
import { Download, Mail, User, CreditCard, FileText } from "lucide-react";
import ResendModel from "./_component/ResendModal";
import { useUser } from "@/provider/UserProvider";
import { Button } from "@/components/ui/button";
import { confirmBooking } from "@/graphql/booking";
import { toast } from "sonner";
import { truncateDescription } from "@/lib/utils";

const Preview = () => {
  const { id } = useParams();
  const {
    bookingDetail,
    total,
    loading,
    resendLoading,
    setResendLoading,
    confirmLoading,
    setConfirmLoading,
  } = usePreview(id);
  const { user } = useUser();

  const downloadTicket = (ticketUrl: string) => {
    const link = document.createElement("a");
    link.href = ticketUrl;
    link.target = "_blank";
    link.click();
  };

  const handleConfirm = async () => {
    if (!id) return;
    setConfirmLoading(true);
    try {
      const res = await confirmBooking(id);
      if (res.data) {
        setConfirmLoading(false);
        window.location.reload();
        toast.success("Booking Confirmed Successfully");
      }
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setConfirmLoading(false);
    }
  };

  if (loading || !bookingDetail) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-indigo-600 font-bold">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <BackBtn route="/bookings" title="Back to My Bookings" />

      <div className="flex flex-col gap-6">
        {/* HEADER SECTION */}
        <div className="border-b border-[#E2E8F0] pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Status & Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#0F172B]">
                  {bookingDetail.transactionRefNumber}
                </h2>
                {bookingDetail.status && (
                  <div className="bg-[#DCFCE7] border border-[#7BF1A8] px-3 py-1 rounded-[4px]">
                    <p className="text-[#008236] text-sm font-medium">
                      {bookingDetail.status}
                    </p>
                  </div>
                )}
                {bookingDetail.isTicketConfirmed && (
                  <div className="bg-blue-100 border border-blue-200 px-3 py-1 rounded-[4px]">
                    <p className="text-blue-700 text-sm font-medium">
                      Ticket Confirmed
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-[#45556C]">
                <span>
                  <span className="font-semibold">Transacted:</span>{" "}
                  {format(
                    new Date(bookingDetail.transactedTime),
                    "dd MMM yyyy hh:mm a"
                  )}
                </span>
                {bookingDetail.paidTime && (
                  <span>
                    <span className="font-semibold">Paid:</span>{" "}
                    {format(
                      new Date(bookingDetail.paidTime),
                      "dd MMM yyyy hh:mm a"
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Total & IDs */}
            <div className="text-right">
              <p className="text-sm text-[#45556C] mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-[#F54900]">
                THB {total || bookingDetail.transactedAmount}
              </p>
              <div className="text-xs text-gray-400 mt-1">
                Globaltix ID: {bookingDetail.globaltixTransactionId}
              </div>
            </div>
          </div>
        </div>

        {/* TRANSACTION INFORMATION */}
        <div className="border border-gray-300 rounded-[10px] overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 py-3 px-6 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-600" />
            <p className="text-[#0F172B] text-lg font-medium">
              Transaction Details
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoRow label="Transacted By" value={bookingDetail.transactedBy} />
            <InfoRow
              label="Payment Method"
              value={bookingDetail.paymentMethod}
            />
            {bookingDetail.paymentMethod === "AYAPAY" && (
              <InfoRow
                label="Payment Amount"
                value={`MMK ${bookingDetail.paymentDetail?.amount?.toLocaleString()}`}
              />
            )}
            <InfoRow label="Group Name" value={bookingDetail.groupName} />
            <InfoRow
              label="Members In Group"
              value={bookingDetail.membersInGroup?.toString()}
            />

            <div className="md:col-span-2 lg:col-span-3 space-y-1">
              <p className="text-xs text-[#64748B] uppercase font-semibold">
                Remarks
              </p>
              <p className="text-sm text-[#0F172B] bg-slate-50 p-2 rounded border border-slate-100">
                {bookingDetail.remarks || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* CUSTOMER INFORMATION */}
        <div className="border border-gray-300 rounded-[10px] overflow-hidden">
          <div className="bg-indigo-100 border-b border-indigo-200 py-3 px-6 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-700" />
            <p className="text-[#0F172B] text-lg font-medium">
              Customer Information
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guest/Contact Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#45556C] uppercase tracking-wide">
                Guest / Contact
              </h3>
              <InfoRow label="Guest Name" value={bookingDetail.guestName} />
              <InfoRow label="Guest Email" value={bookingDetail.guestEmail} />
              <InfoRow
                label="Guest Phone"
                value={
                  `${bookingDetail.mobilePrefix || ""} ${
                    bookingDetail.guestPhone || ""
                  }`.trim() || "-"
                }
              />
              <InfoRow
                label="Alternate Email"
                value={bookingDetail.alternateEmail}
              />
            </div>

            {/* Other Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#45556C] uppercase tracking-wide">
                Identification
              </h3>
              <InfoRow
                label="Customer Name"
                value={bookingDetail.customerName}
              />
              <InfoRow
                label="Passport Number"
                value={bookingDetail.passportNumber}
              />
            </div>
          </div>
        </div>

        {/* PRODUCT / BOOKING DETAILS */}
        <div className="w-full border border-gray-300 rounded-[10px] overflow-hidden">
          <div className="bg-indigo-100 border-b border-indigo-200 py-3 px-6 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-700" />
            <p className="text-[#0F172B] text-lg font-medium">
              Product Tickets
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow className="bg-indigo-100 hover:bg-indigo-100">
                  <TableHead className="w-[80px]">QR</TableHead>
                  <TableHead className="w-[120px]">Code</TableHead>
                  <TableHead className="max-w-[250px]">Product Name</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Visit Date & Time</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>From Reseller</TableHead>
                  <TableHead>Rate (THB)</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Total (THB)</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {bookingDetail.bookingTickets.map((data, i) => (
                  <TableRow key={i}>
                    {/* QR Code */}
                    <TableCell>
                      <div className="relative w-10 h-10">
                        {data.qrCode ? (
                          <img
                            alt="base 64 image"
                            src={`data:image/png;base64,${data.qrCode}`}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                        ) : (
                          <img
                            alt="ticket image"
                            src={preFixImg(data.image)}
                            className="object-cover object-center w-10 h-10 rounded-xl"
                          />
                        )}
                      </div>
                    </TableCell>

                    {/* Code */}
                    <TableCell>
                      <span className="text-sm text-[#155DFC] font-medium">
                        {data.code}
                      </span>
                    </TableCell>

                    {/* Product Info */}
                    <TableCell className="max-w-[250px]">
                      <p title={data.productName} className="text-sm font-semibold text-[#0F172B]">
                        {truncateDescription(data.productName,10)}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {data.productOptionName}
                      </p>
                    </TableCell>

                    {/* Ticket Type */}
                    <TableCell>
                      <p className="text-sm text-[#314158]">
                        {data.ticketTypeName}
                      </p>
                    </TableCell>

                    {/* Visit Date & Time */}
                    <TableCell>
                      <div className="flex flex-col">
                        <p className="text-sm text-[#314158]">
                          {format(data.visitDate, "dd MMM yyyy")}
                        </p>
                        {data.eventTime && (
                          <p className="text-xs text-gray-500">
                            {format(data.eventTime, "hh:mm a")}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Issued Date */}
                    <TableCell>
                      <p className="text-sm text-[#314158]">
                        {data.issuedDate
                          ? format(data.issuedDate, "dd MMM yyyy")
                          : "-"}
                      </p>
                    </TableCell>

                    {/* Format */}
                    <TableCell>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {data.ticketFormat}
                      </span>
                    </TableCell>

                    {/* From Reseller */}
                    <TableCell>
                      {data.fromResellerId ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Yes
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Rate */}
                    <TableCell>
                      <p className="text-sm text-[#314158]">
                        {data.price.toFixed(2)}
                      </p>
                    </TableCell>

                    {/* Qty */}
                    <TableCell>
                      <p className="text-sm font-medium text-[#0F172B]">
                        {data.quantity}
                      </p>
                    </TableCell>

                    {/* Sub Total */}
                    <TableCell className="text-right">
                      <p className="text-sm text-[#F54900] font-bold">
                        {(data.price * data.quantity).toFixed(2)}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
          <div className="text-sm text-gray-500">
            {bookingDetail.viewTicketUrl && (
              <a
                href={bookingDetail.viewTicketUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-indigo-600"
              >
                View Ticket URL
              </a>
            )}
          </div>

          <div className="flex items-center gap-4">
            {(!bookingDetail.requiresManualConfirm ||
              bookingDetail.isTicketConfirmed) && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setResendLoading(true)}
                  disabled={resendLoading}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {resendLoading ? "Loading..." : "Resend Email"}
                </Button>
                <Button
                  disabled={resendLoading}
                  onClick={() => downloadTicket(bookingDetail.eTicketUrl)}
                  className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800"
                >
                  <Download className="w-4 h-4" />
                  Download E-Ticket
                </Button>
              </>
            )}

            {user.type === "OWNER" &&
              bookingDetail.requiresManualConfirm &&
              !bookingDetail.isTicketConfirmed && (
                <Button
                  disabled={confirmLoading}
                  onClick={handleConfirm}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {confirmLoading ? "Loading..." : "Confirm Booking"}
                </Button>
              )}
          </div>
        </div>
      </div>
      <ResendModel
        open={resendLoading}
        onClose={() => setResendLoading(false)}
        email={bookingDetail.guestEmail || ""}
        id={bookingDetail.id}
      />
    </PageContainer>
  );
};

// Helper component for consistent row rendering
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 last:border-0">
    <p className="text-sm text-[#64748B] min-w-[140px]">{label}</p>
    <p className="text-sm font-medium text-[#0F172B] text-right break-all">
      {value !== undefined && value !== null && value !== "" ? value : "-"}
    </p>
  </div>
);

export default Preview;
