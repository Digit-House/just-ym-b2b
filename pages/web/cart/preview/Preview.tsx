import React from "react";
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
import { preFixImg } from "@/util/initData";
import { Download, Mail } from "lucide-react";
import ResendModel from "./_component/ResendModal";

const Preview = () => {
  const { id } = useParams();
  const {
    bookingDetail,
    setBookingDetail,
    total,
    setTotal,
    loading,
    resendLoading,
    setResendLoading,
  } = usePreview(id);

  const downloadTicket = (ticketUrl: string) => {
    const link = document.createElement("a");
    link.href = ticketUrl;
    link.target = "_blank";
    link.click();
  };

  const submitResendEmail = async () => {};

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
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <p className="text-[#45556C] text-sm">
            {format(
              new Date(bookingDetail.transactedTime),
              "dd MMM yyyy hh:mm a"
            )}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold text-[#F54900]">THB {total}</p>
            <div className="bg-[#DCFCE7] border border-[#7BF1A8] px-3 py-1 rounded-[4px]">
              <p className="text-[#008236] text-sm font-medium">
                {bookingDetail.status}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className=" border border-gray-300 rounded-[10px] overflow-hidden">
          <div className="bg-indigo-100 border-b border-indigo-200 py-3 px-6">
            {/* <Typo
                text="Transaction Information"
                size="lg"
                fontWeight="medium"
                className="text-[#0F172B]"
              /> */}
            <p className="text-[#0F172B] text-lg font-medium">
              Customer Information
            </p>
          </div>
          <div className="flex flex-col w-full p-4 gap-2.5">
            <div className="flex items-center justify-between w-full py-2">
              <p className="text-[#45556C] ">Customer Name:</p>
              <p className="text-[#0F172B] ">{bookingDetail.guestName}</p>
            </div>
            <div className="flex items-center justify-between w-full py-2">
              <p className="text-[#45556C] ">Customer Email:</p>
              <p className="text-[#0F172B] ">{bookingDetail.guestEmail}</p>
            </div>
            <div className="flex items-center justify-between w-full py-2">
              <p className="text-[#45556C] ">Customer Mobile Number:</p>
              <p className="text-[#0F172B] ">
                {bookingDetail.guestPhone || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="w-full border border-gray-300 rounded-[10px] overflow-hidden">
          <div className="bg-indigo-100 border-b border-indigo-200 py-3 px-6">
            {/* <Typo
              text="Products"
              size="lg"
              fontWeight="medium"
              className="text-[#0F172B]"
            /> */}
            <p className="text-[#0F172B] text-lg font-medium">Product</p>
          </div>
          <Table className="px-4">
            <TableHeader>
              <TableRow className="bg-indigo-100">
                <TableHead className="w-[120px]">QR Code</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="max-w-[300px]">Name</TableHead>
                <TableHead>From Reseller</TableHead>
                <TableHead>Event Date Time</TableHead>
                <TableHead>Settlement Rate</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Sub Total</TableHead>
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
                        />
                      ) : (
                        <img
                          alt="ticket image"
                          src={preFixImg(data.image)}
                          // width={40}
                          // height={40}
                          className="object-cover object-center w-10 h-10 rounded-xl"
                        />
                      )}
                    </div>
                  </TableCell>

                  {/* Code */}
                  <TableCell>
                    {/* <Typo
                        text={data.code}
                        className="text-[#155DFC]"
                        size="sm"
                      /> */}
                    <p className="text-sm text-[#155DFC]">{data.code}</p>
                  </TableCell>

                  {/* Name */}
                  <TableCell className="max-w-[300px] whitespace-normal wrap-break-word">
                    <div className="max-w-[300px]">
                      <p className="text-[#314158] max-w-[300px] text-sm font-medium">
                        {data.productName}| ${data.productOptionName}
                      </p>
                      <p className="text-[#314158] max-w-[300px] text-sm font-medium">
                        {data.ticketTypeName}
                      </p>
                      {/* <Typo
                          text={`${data.productName}| ${data.productOptionName}`}
                          size="sm"
                          className="text-[#314158] max-w-[300px]"
                        />
                        <Typo
                          text={`| ${data.ticketTypeName}`}
                          size="sm"
                          className="text-[#314158] max-w-[300px]"
                        /> */}
                    </div>
                  </TableCell>

                  {/* From Reseller */}
                  <TableCell>
                    {/* <Typo
                        text={data.fromResellerId ? "Yes" : "-"}
                        size="sm"
                        className="text-[#314158]"
                      /> */}
                    <p className="text-[#314158] text-sm">
                      {data.fromResellerId ? "Yes" : "-"}
                    </p>
                  </TableCell>

                  {/* Event Date Time */}
                  <TableCell>
                    <p className="text-[#314158] text-sm">
                      {format(data.visitDate, "dd MMM yyyy hh:mm a")}
                    </p>
                  </TableCell>

                  {/* Settlement Rate */}
                  <TableCell>
                    <p className="text-[#314158] text-sm">
                      THB {data.price.toString()}
                    </p>
                  </TableCell>

                  {/* Qty */}
                  <TableCell>
                    <p className="text-[#314158] text-sm">
                      {data.quantity.toString()}
                    </p>
                  </TableCell>

                  {/* Sub Total */}
                  <TableCell>
                    <p className="text-sm text-[#F54900] font-medium">
                      THB {data.price.toString()}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="w-full flex items-center justify-end gap-4">
          <button
            onClick={() => {
              setResendLoading(true);
            }}
            disabled={resendLoading}
            className="flex items-center gap-2 bg-[#155DFC] text-white rounded-[4px] shadow-[0px_1px_3px_0px_#0000001A] px-4 py-2 cursor-pointer hover:bg-[#155DFC]/80 transition-all duration-300 disabled:cursor-not-allowed"
          >
            {resendLoading ? (
              <span className="text-gray-300 loading loading-bars loading-md">
                Loading...
              </span>
            ) : (
              <div className="flex items-center w-full gap-2">
                <Mail className="w-4 h-4" />
                <span>Resend Email to Customer</span>
              </div>
            )}
          </button>
          <button
            disabled={resendLoading}
            onClick={() => {
              downloadTicket(bookingDetail.eTicketUrl);
            }}
            className="flex items-center gap-2 bg-indigo-700 text-white rounded-[4px] shadow-[0px_1px_3px_0px_#0000001A] px-4 py-2 cursor-pointer hover:bg-primary/80 transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            <span>Download E-Ticket</span>
          </button>
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

export default Preview;
