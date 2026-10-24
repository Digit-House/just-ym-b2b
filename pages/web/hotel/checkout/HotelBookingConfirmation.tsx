import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
  CalendarX2,
  Download,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";
import ImageFallback from "@/components/ImageFallback";
import { Button } from "@/components/ui/button";
import { useHotelBookingStore } from "@/store/useHotelBookingStore";
import ResendModel from "../../cart/preview/_component/ResendModal";
import {
  filterValidHotelImages,
  getBookingItinerary,
  getHotelInfo,
  HOTEL_IMAGE_PLACEHOLDER,
  resolveHotelImageUrl,
  resolveHotelVoucherUrl,
} from "@/graphql/hotel";

const STAMP_STYLES: Record<string, string> = {
  PAID: "border-red-700 text-red-700",
  PENDING: "border-amber-500 text-amber-500",
  FAILED: "border-gray-500 text-gray-500",
  EXPIRED: "border-gray-500 text-gray-500",
};

const DetailCell = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) => (
  <div className="border-l-2 border-indigo-200 pl-4 flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wide text-gray-500">
      {label}
    </span>
    <span className="text-lg font-medium text-gray-900">{value}</span>
    {sub && <span className="text-sm text-gray-400">{sub}</span>}
  </div>
);

type Props = {
  // The same page serves both the post-checkout confirmation (back to hotel search)
  // and the My Bookings hotel detail (back to the bookings list).
  backRoute?: string;
  backTitle?: string;
};

const HotelBookingConfirmation = ({
  backRoute = "/hotels",
  backTitle = "Back to Hotels",
}: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contactInfo } = useHotelBookingStore();
  const [resendOpen, setResendOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const {
    data: itinerary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookingItinerary", id],
    queryFn: () => getBookingItinerary(id!),
    enabled: !!id,
    // The voucher PDF is generated server-side after the reservation is created —
    // keep refetching until it's ready so the Download button can go live.
    refetchInterval: (query) =>
      query.state.data?.voucherStatus === "GENERATING" ? 4000 : false,
  });

  const hotelStaticId = itinerary?.hotelStaticId;

  const { data: hotelInfo } = useQuery({
    queryKey: ["hotelInfo", hotelStaticId],
    queryFn: () => getHotelInfo(hotelStaticId!),
    enabled: !!hotelStaticId,
  });

  // Bad/foreign id or the query itself failing — nothing to show, go back.
  useEffect(() => {
    if (!id || isError) navigate(backRoute, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isError]);

  if (isLoading || !itinerary) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </PageContainer>
    );
  }

  const r = itinerary;
  const hotelName = r.hotelName ?? hotelInfo?.name ?? "Hotel";
  const hotelAddress = [
    hotelInfo?.address,
    hotelInfo?.region_meta?.country_name,
  ]
    .filter(Boolean)
    .join(", ");

  const heroSrc =
    resolveHotelImageUrl(
      filterValidHotelImages(hotelInfo?.images)[0],
      "1024x768",
    ) ||
    resolveHotelImageUrl(r.hotelThumbnail, "1024x768") ||
    HOTEL_IMAGE_PLACEHOLDER;

  const totalAdults = r.rooms.reduce((s, room) => s + room.adults, 0);
  const totalChildren = r.rooms.reduce((s, room) => s + room.children, 0);
  const totalGuests = totalAdults + totalChildren;

  const latitude = hotelInfo?.latitude;
  const longitude = hotelInfo?.longitude;

  const voucherReady = r.voucherStatus === "READY" && !!r.voucherUrl;

  // The voucher lives on a different origin, where an anchor's download attribute is
  // ignored — the PDF just opens in a tab. Fetching it into a blob keeps the object URL
  // same-origin so the browser actually saves the file.
  const downloadVoucher = async (voucherUrl: string) => {
    const url = resolveHotelVoucherUrl(voucherUrl);
    setDownloading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `booking-voucher-${r.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Network/CORS hiccup — at least open the PDF so the guest can save it manually.
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const cancellationText = r.freeCancellationBefore
    ? `Free cancellation until ${format(
        parseISO(r.freeCancellationBefore),
        "d MMM yyyy, HH:mm",
      )}. After that, penalties apply per the rate conditions.`
    : r.isCancellable
      ? "This booking can be cancelled, but penalties may apply per the rate conditions. Contact support before making any changes."
      : "Non-refundable. Any cancellations or modifications will result in the forfeiture of the total booking amount.";

  return (
    <PageContainer>
      <BackBtn route={backRoute} title={backTitle} />

      <div className="flex flex-col gap-8 w-full py-4">
        {/* Header: voucher id & download */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm uppercase tracking-wide text-indigo-600">
              Official Confirmation
            </span>
            <h1 className="text-2xl font-bold text-gray-900">
              Booking Voucher
            </h1>
            <p className="font-medium text-gray-500">
              Reservation ID: <span className="text-gray-900">#{r.id}</span>
            </p>
            {r.hotelConfirmationNumber && (
              <p className="text-sm text-gray-500">
                Hotel confirmation:{" "}
                <span className="text-gray-900">
                  {r.hotelConfirmationNumber}
                </span>
              </p>
            )}
          </div>
          {voucherReady ? (
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                onClick={() => setResendOpen(true)}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Resend Email
              </Button>
              <Button
                disabled={downloading}
                onClick={() => downloadVoucher(r.voucherUrl!)}
                className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Downloading…" : "Download PDF"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-50 text-sm font-semibold text-gray-400 shrink-0 w-fit cursor-not-allowed">
              <Loader2 className="w-4 h-4 animate-spin" />
              Preparing PDF…
            </div>
          )}
        </div>

        {/* Hero image with status stamp */}
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <div className="h-[300px] w-full">
            <ImageFallback
              src={heroSrc}
              fallbackSrc={HOTEL_IMAGE_PLACEHOLDER}
              alt={hotelName}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Plain single-declaration gradient — the from/via gradient utilities resolve
              through @property-registered vars and an oklab interpolation hint, which some
              browsers drop wholesale, leaving no overlay at all. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_60%)]" />
          <div className="absolute bottom-5 left-5 right-5">
            <h2 className="text-xl font-bold text-white">{hotelName}</h2>
            {hotelAddress && (
              <p className="text-sm font-medium text-white/90 mt-1">
                {hotelAddress}
              </p>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`border-4 rounded-2xl px-10 py-4 opacity-30 ${
                STAMP_STYLES[r.status] ?? "border-gray-500 text-gray-500"
              }`}
            >
              <span className="text-6xl font-extrabold tracking-wide">
                {r.status}
              </span>
            </div>
          </div>
        </div>

        {/* Property information */}
        <div className="flex flex-col gap-6 pt-2">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="uppercase tracking-wide text-indigo-600">
              Property Information
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-md">
              <p className="text-lg font-bold text-gray-900">{hotelName}</p>
              {hotelAddress && <p className="text-gray-600">{hotelAddress}</p>}
            </div>
            {hotelInfo?.phone && (
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-xs uppercase tracking-wide text-indigo-600">
                    Contact Support
                  </span>
                  <span className="text-gray-900">{hotelInfo.phone}</span>
                </div>
                <div className="size-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-indigo-700" />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            <DetailCell
              label="Check-in"
              value={format(parseISO(r.checkin), "MMM d, yyyy")}
              sub={
                hotelInfo?.check_in_time
                  ? `From ${hotelInfo.check_in_time}`
                  : undefined
              }
            />
            <DetailCell
              label="Check-out"
              value={format(parseISO(r.checkout), "MMM d, yyyy")}
              sub={
                hotelInfo?.check_out_time
                  ? `Until ${hotelInfo.check_out_time}`
                  : undefined
              }
            />
            {totalGuests > 0 && (
              <DetailCell
                label="Guests"
                value={`${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}`}
                sub={
                  `${totalAdults} Adult${totalAdults !== 1 ? "s" : ""}` +
                  (totalChildren > 0
                    ? `, ${totalChildren} Child${totalChildren !== 1 ? "ren" : ""}`
                    : "")
                }
              />
            )}
            <DetailCell
              label="Accommodation"
              value={r.roomName ?? "Room"}
              sub={`${r.nights} night${r.nights !== 1 ? "s" : ""} · ${
                r.currencyCode
              } ${Number(r.paymentAmount).toLocaleString()}`}
            />
          </div>
        </div>

        {/* Essential information */}
        <div className="bg-indigo-50/60 rounded-xl px-6 py-8 flex flex-col gap-6">
          <h3 className="text-base font-bold uppercase tracking-[0.2em] text-gray-900">
            Essential Information
          </h3>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex gap-4">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="font-bold text-gray-900">Check-in Requirements</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  A valid government-issued photo identification and a credit
                  card or cash deposit are required at check-in for incidental
                  charges.
                </p>
              </div>
            </div>
            <div className="flex-1 flex gap-4">
              <CalendarX2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="font-bold text-gray-900">Cancellation Policy</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {cancellationText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        {latitude != null && longitude != null && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Location</h3>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-indigo-700 hover:text-indigo-800"
              >
                Get Directions
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="relative h-[320px] rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Hotel location"
                src={`https://www.google.com/maps?q=${latitude},${longitude}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-6 left-6 max-w-[calc(100%-3rem)] w-[320px] backdrop-blur-md bg-white/70 border border-white/20 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-700">
                  Resort Address
                </span>
                <p className="text-sm font-medium text-gray-900">
                  {hotelAddress || hotelName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ResendModel
        open={resendOpen}
        onClose={() => setResendOpen(false)}
        email={contactInfo?.email || ""}
        id={r.id}
      />
    </PageContainer>
  );
};

export default HotelBookingConfirmation;
