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
import {
  Download,
  Mail,
  User,
  CreditCard,
  FileText,
  Info,
  RefreshCw,
  Upload,
  X,
} from "lucide-react"; // Added Info and RefreshCw
import ResendModel from "./_component/ResendModal";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/provider/UserProvider";
import { Button } from "@/components/ui/button";
import {
  confirmBooking,
  refreshBooking,
  uploadBookingVoucher,
} from "@/graphql/booking";
import { toast } from "sonner";
import { notifyManualConfirmChanged } from "@/hooks/useManualConfirmCount";
import SupplierStatusBadge from "@/pages/web/booking/_component/SupplierStatusBadge";
import BookingFailedApology from "@/pages/web/booking/_component/BookingFailedApology";
import MascotLoader from "@/components/MascotLoader";
import ButtonSpinner from "@/components/ButtonSpinner";


const MAX_VOUCHER_BYTES = 4 * 1024 * 1024; // matches the backend presigned content-length-range
const NOT_UPLOADED_MSG = "Upload the ticket before you confirm this booking.";

const Preview = () => {
  const { id } = useParams();
  const {
    bookingDetail,
    setBookingDetail,
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

  const isOwner = user?.type === "OWNER";
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Local blob URL for the preview only; revoked when the file changes or on unmount.
  useEffect(() => {
    if (!pickedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(pickedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pickedFile]);

  const handleRefresh = async () => {
    if (!isOwner || !id) {
      window.location.reload();
      return;
    }
    setRefreshLoading(true);
    try {
      const res = await refreshBooking(id);
      const out = (res.data as any)?.refreshBooking;
      if (out?.isTicketReady && !out.eTicketUrl) {
        toast.error(
          "Voucher still held: the logo edit needs a developer fix. See the Discord alert."
        );
        setRefreshLoading(false);
        return;
      }
      window.location.reload();
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
      setRefreshLoading(false);
    }
  };

  // Picking only validates and holds the file locally; nothing is uploaded until Save.
  const handlePickVoucher = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Voucher must be a PDF file (application/pdf).");
      return;
    }
    if (file.size > MAX_VOUCHER_BYTES) {
      toast.error("Voucher is too large. The limit is 4 MB.");
      return;
    }
    setPickedFile(file);
  };

  const clearPicked = () => {
    setPreviewOpen(false);
    setPickedFile(null);
  };

  const handleSaveVoucher = async () => {
    if (!pickedFile || !id || uploadLoading) return;
    setUploadLoading(true);
    try {
      const res = await uploadBookingVoucher(id, pickedFile);
      const out = (res.data as any)?.uploadBookingVoucher;
      toast.success("Voucher uploaded");
      notifyManualConfirmChanged();
      if (bookingDetail && out) {
        setBookingDetail({
          ...bookingDetail,
          eTicketUrl: out.eTicketUrl ?? bookingDetail.eTicketUrl,
        });
      }
      clearPicked();
    } catch (err) {
      toast.error(getErrMsg(err as any, "message"));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!id) return;
    setConfirmLoading(true);
    try {
      const res = await confirmBooking(id);
      if (res.data) {
        setConfirmLoading(false);
        notifyManualConfirmChanged();
        window.location.reload();
        toast.success("Booking Confirmed Successfully");
      }
    } catch (err) {
      toast.error(
        getErrMsg(err as any, "code") === "TICKET_NOT_UPLOADED" ||
          String(getErrMsg(err as any, "message")).includes("TICKET_NOT_UPLOADED")
          ? NOT_UPLOADED_MSG
          : getErrMsg(err as any, "message")
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  // Helper component for text with Info Icon and Tooltip
  const InfoText = ({
    text,
    maxLength = 20,
  }: {
    text: string;
    maxLength?: number;
  }) => {
    const shouldTruncate = text.length > maxLength;

    return (
      <div className="flex items-center gap-1.5 group relative max-w-full">
        <span className="truncate" title={shouldTruncate ? text : undefined}>
          {shouldTruncate ? text.substring(0, maxLength) + "..." : text}
        </span>

        {shouldTruncate && (
          <>
            <Info
              size={14}
              className="text-indigo-400 cursor-help shrink-0 hover:text-indigo-600 transition-colors"
            />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
              <p className="break-words leading-relaxed">{text}</p>
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading || !bookingDetail) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <MascotLoader label="Loading booking..." />
      </div>
    );
  }

  return (
    <PageContainer>
      {/* Header with Back and Refresh Buttons */}
      <div className="flex items-center justify-between mb-6">
        <BackBtn route="/bookings" title="Back to My Bookings" />
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={refreshLoading}
          title="Refresh Page"
          className="rounded-full hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
        >
          <RefreshCw size={18} className={refreshLoading ? "animate-spin" : ""} />
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* HEADER SECTION */}
        <div className="border-b border-[#E2E8F0] pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Status & Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
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
                {user?.type === "OWNER" && (
                  <SupplierStatusBadge
                    status={bookingDetail.supplierStatus}
                    prefix="Supplier status:"
                  />
                )}
                <BookingFailedApology
                  transactionId={bookingDetail.id}
                  isFailed={bookingDetail.status === "FAILED" || bookingDetail.supplierStatus === "FAILED"}
                  sentAt={bookingDetail.bookingFailedApologySentAt}
                  voucherCode={bookingDetail.bookingFailedApologyVoucherCode}
                  onSent={(sentAt, voucherCode) =>
                    setBookingDetail({
                      ...bookingDetail,
                      bookingFailedApologySentAt: sentAt,
                      bookingFailedApologyVoucherCode: voucherCode,
                    })
                  }
                />
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

                    {/* Product Info - Updated with Info Icon */}
                    <TableCell className="max-w-[250px]">
                      <div className="flex flex-col gap-1">
                        <InfoText text={data.productName} maxLength={20} />
                        <div className="text-xs text-[#64748B] pl-1">
                          <InfoText
                            text={data.productOptionName}
                            maxLength={25}
                          />
                        </div>
                      </div>
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
            {isOwner && bookingDetail.viewTicketUrl && (
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
                  {resendLoading ? <ButtonSpinner /> : <Mail className="w-4 h-4" />}
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

            {isOwner && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePickVoucher}
                />
                {pickedFile ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 pl-2 text-sm">
                      <button
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="flex items-center gap-1 py-1 text-indigo-600 hover:underline cursor-pointer"
                        title="Preview PDF"
                      >
                        <FileText className="w-4 h-4" />
                        {pickedFile.name} (
                        {(pickedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </button>
                      <button
                        type="button"
                        aria-label="Remove file"
                        disabled={uploadLoading}
                        onClick={clearPicked}
                        className="p-1 text-gray-500 hover:text-gray-800 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                    <Button
                      disabled={uploadLoading}
                      onClick={handleSaveVoucher}
                      className="flex items-center gap-2"
                    >
                      {uploadLoading && <ButtonSpinner />}
                      {uploadLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Choose voucher PDF
                  </Button>
                )}
                <Dialog
                  open={previewOpen}
                  onOpenChange={(o) => !uploadLoading && setPreviewOpen(o)}
                >
                  <DialogContent className="inset-0 m-auto flex h-[90vh] w-[95vw] max-w-[95vw] translate-x-0 translate-y-0 flex-col sm:max-w-5xl">
                    <DialogHeader>
                      <DialogTitle className="truncate pr-6">{pickedFile?.name}</DialogTitle>
                    </DialogHeader>
                    {previewUrl && (
                      <iframe
                        src={`${previewUrl}#view=FitH`}
                        title="Voucher preview"
                        className="min-h-0 w-full flex-1 rounded border"
                      />
                    )}
                    <DialogFooter>
                      <Button
                        variant="outline"
                        disabled={uploadLoading}
                        onClick={clearPicked}
                      >
                        Cancel
                      </Button>
                      <Button disabled={uploadLoading} onClick={handleSaveVoucher}>
                        {uploadLoading && <ButtonSpinner />}
                        {uploadLoading ? "Saving..." : "Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {isOwner &&
              bookingDetail.requiresManualConfirm &&
              !bookingDetail.isTicketConfirmed && (
                <Button
                  disabled={confirmLoading || !bookingDetail.eTicketUrl}
                  title={!bookingDetail.eTicketUrl ? NOT_UPLOADED_MSG : undefined}
                  onClick={handleConfirm}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {confirmLoading && <ButtonSpinner />}
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
