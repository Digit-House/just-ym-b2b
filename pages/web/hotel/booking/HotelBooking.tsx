import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

import PageContainer from "@/components/PageContainer";
import BackBtn from "@/components/BackBtn";
import ImageFallback from "@/components/ImageFallback";
import { HOTEL_IMAGE_PLACEHOLDER } from "@/graphql/hotel";
import { useHotelBookingStore } from "@/store/useHotelBookingStore";
import ContactInfoSection from "./_components/ContactInfoSection";
import GuestInfoSection from "./_components/GuestInfoSection";
import SpecialRequestsSection from "./_components/SpecialRequestsSection";
import ConfirmBar from "./_components/ConfirmBar";

const HotelBooking = () => {
  const navigate = useNavigate();
  const { selection, contactInfo, guestNames } = useHotelBookingStore();

  const [currentOpen, setCurrentOpen] = useState(1);
  const [section1Open, setSection1Open] = useState(true);
  const [section2Open, setSection2Open] = useState(false);
  const [section3Open, setSection3Open] = useState(false);
  const [section1Done, setSection1Done] = useState(!!contactInfo);
  const [section2Done, setSection2Done] = useState(guestNames.length > 0);

  // No selection to book (direct visit, cleared store, or a refresh after the
  // in-memory search state expired) — send the guest back to browse hotels.
  useEffect(() => {
    if (!selection) {
      navigate("/hotels", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  useEffect(() => {
    if (currentOpen === 2) {
      setSection1Open(false);
      setSection2Open(true);
    }
    if (currentOpen === 3) {
      setSection2Open(false);
      setSection3Open(true);
    }
  }, [currentOpen]);

  if (!selection) return null;

  const totalGuests = selection.guests.reduce(
    (s, r) => s + r.adults + r.children.length,
    0
  );

  const handleConfirm = () => {
    navigate(`/hotels/${selection.hotelId}/checkout`);
  };

  return (
    <PageContainer className="space-y-8">
      <BackBtn route={`/hotels/${selection.hotelId}`} title="Back to Hotel" />

      <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <ImageFallback
            src={selection.hotelImage}
            fallbackSrc={HOTEL_IMAGE_PLACEHOLDER}
            alt={selection.hotelName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900">{selection.hotelName}</p>
          <p className="text-sm text-gray-500">{selection.roomName}</p>
          <p className="text-xs text-gray-400 mt-1">
            {format(parseISO(selection.checkin), "d MMM yyyy")} –{" "}
            {format(parseISO(selection.checkout), "d MMM yyyy")} ·{" "}
            {totalGuests} guest{totalGuests !== 1 ? "s" : ""}
          </p>
        </div>
        {selection.amount && (
          <p className="font-bold text-gray-900 shrink-0">
            {selection.currency} {Number(selection.amount).toLocaleString()}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <ContactInfoSection
          open={section1Open}
          setOpen={setSection1Open}
          onDone={() => {
            setSection1Done(true);
            setCurrentOpen(2);
          }}
        />

        <GuestInfoSection
          open={section2Open}
          setOpen={setSection2Open}
          guests={selection.guests}
          roomName={selection.roomName}
          onDone={() => {
            setSection2Done(true);
            setCurrentOpen(3);
          }}
        />

        <SpecialRequestsSection
          open={section3Open}
          setOpen={setSection3Open}
          onDone={() => setSection3Open(false)}
        />

        <ConfirmBar
          disabled={!section1Done || !section2Done}
          onConfirm={handleConfirm}
        />
      </div>
    </PageContainer>
  );
};

export default HotelBooking;
