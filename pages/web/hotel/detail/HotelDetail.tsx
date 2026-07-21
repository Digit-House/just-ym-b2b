import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Share2, Star } from "lucide-react";
import { toast } from "sonner";

import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";
import {
  filterValidHotelImages,
  getHotelInfo,
  getHotelRooms,
  HOTEL_IMAGE_PLACEHOLDER,
  resolveHotelImageUrl,
} from "@/graphql/hotel";
import { HotelGuestInput, HotelRoomRateT } from "@/types/hotel.type";
import { useHotelBookingStore } from "@/store/useHotelBookingStore";
import { useHotelSearch } from "../useHotelSearch";
import HotelGallery from "./_components/HotelGallery";
import AvailabilityBar, {
  AvailabilitySearch,
} from "./_components/AvailabilityBar";
import RoomTypeCard from "./_components/RoomTypeCard";
import BookingSidebar, { SelectedRateT } from "./_components/BookingSidebar";

type LocationState = {
  checkin?: string;
  checkout?: string;
  guests?: HotelGuestInput[];
  residency?: string;
  residencyLabel?: string;
};

const HotelDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { search: persistedSearch } = useHotelSearch();
  const { setSelection } = useHotelBookingStore();
  const locationState = (location.state as LocationState) ?? {};

  const [activeSearch, setActiveSearch] = useState<AvailabilitySearch>({
    checkin: locationState.checkin ?? persistedSearch.checkin,
    checkout: locationState.checkout ?? persistedSearch.checkout,
    guests: locationState.guests ?? persistedSearch.guests,
    residency: locationState.residency ?? persistedSearch.residency,
    residencyLabel:
      locationState.residencyLabel ?? persistedSearch.residencyLabel,
  });

  const [selectedRoomTypeKey, setSelectedRoomTypeKey] = useState<string>("all");
  const [selectedRate, setSelectedRate] = useState<SelectedRateT | null>(null);

  const {
    data: hotelInfo,
    isPending: infoPending,
    isError: infoError,
  } = useQuery({
    queryKey: ["hotelInfo", id],
    queryFn: () => getHotelInfo(id as string),
    enabled: !!id,
  });

  const { data: roomTypes = [], isFetching: roomsFetching } = useQuery({
    queryKey: ["hotelRooms", id, activeSearch],
    queryFn: () =>
      getHotelRooms({
        id: id as string,
        checkin: activeSearch.checkin,
        checkout: activeSearch.checkout,
        guests: activeSearch.guests,
        residency: activeSearch.residency,
      }),
    enabled: !!id,
  });

  const images = hotelInfo?.images ?? [];

  const descriptionSections = hotelInfo?.description_struct ?? [];
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const activeSection =
    descriptionSections.find((s) => s.title === activeTab) ??
    descriptionSections[0];

  const visibleRoomTypes =
    selectedRoomTypeKey === "all"
      ? roomTypes
      : roomTypes.filter((g) => g.key === selectedRoomTypeKey);

  // A book_hash is tied to the search that produced it — once dates/guests change and
  // rooms are re-fetched, a previously selected rate's hash may no longer exist (or may
  // silently point at different availability/pricing). Drop it so BookingSidebar and the
  // room cards don't keep showing a stale "Selected" state the guest can't actually book.
  useEffect(() => {
    if (!selectedRate) return;
    const stillExists = roomTypes.some((rt) =>
      rt.rates.some((r) => r.book_hash === selectedRate.rate.book_hash),
    );
    if (!stillExists) setSelectedRate(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTypes]);

  const handleSelectRate = (rate: HotelRoomRateT, roomTypeName: string) => {
    setSelectedRate((prev) =>
      prev?.rate.book_hash === rate.book_hash ? null : { rate, roomTypeName },
    );
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  if (infoPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600 font-medium">
            Loading hotel details...
          </p>
        </div>
      </div>
    );
  }

  if (infoError || !hotelInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Hotel Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              This hotel isn't available for the selected dates, or no longer
              exists.
            </p>
          </div>
          <Link
            to="/hotels"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Browse Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6 w-full lg:w-[90%] mx-auto">
        <div className="flex items-center justify-between">
          <BackBtn route="/hotels" title="Back to Hotels" />
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>

        <HotelGallery
          images={images}
          name={hotelInfo.name ?? ""}
          latitude={hotelInfo.latitude}
          longitude={hotelInfo.longitude}
        />

        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {hotelInfo.name}
            </h1>
            {!!hotelInfo.star_rating && (
              <div className="flex items-center gap-0.5 text-amber-500 shrink-0 mt-1.5">
                {Array.from({ length: hotelInfo.star_rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
            )}
          </div>
          {hotelInfo.address && (
            <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin size={14} /> {hotelInfo.address}
            </p>
          )}
          {hotelInfo.phone && (
            <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <Phone size={14} /> {hotelInfo.phone}
            </p>
          )}
        </div>

        <div id="hotel-availability-bar">
          <AvailabilityBar
            {...activeSearch}
            loading={roomsFetching}
            onSearch={setActiveSearch}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-gray-900 mb-4">
              What do you prefer?
            </p>

            {roomsFetching && (
              <div className="flex items-center justify-center gap-3 py-16">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">
                  Checking availability...
                </p>
              </div>
            )}

            {!roomsFetching && !!roomTypes.length && (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setSelectedRoomTypeKey("all")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      selectedRoomTypeKey === "all"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-400"
                    }`}
                  >
                    All Type
                  </button>
                  {roomTypes.map((rt) => (
                    <button
                      key={rt.key}
                      onClick={() => setSelectedRoomTypeKey(rt.key)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                        selectedRoomTypeKey === rt.key
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-400"
                      }`}
                    >
                      {rt.name}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  {visibleRoomTypes.map((rt) => (
                    <RoomTypeCard
                      key={rt.key}
                      roomType={rt}
                      selectedBookHash={selectedRate?.rate.book_hash}
                      onSelect={handleSelectRate}
                    />
                  ))}
                </div>
              </>
            )}

            {!roomsFetching && !roomTypes.length && (
              <div className="flex flex-col items-center justify-center gap-2 py-16 bg-white border border-gray-100 rounded-2xl mb-8">
                <p className="text-base font-semibold text-gray-700">
                  No rooms available
                </p>
                <p className="text-sm text-gray-400">
                  Try adjusting your dates or guest count.
                </p>
              </div>
            )}

            {!!descriptionSections.length && (
              <div>
                <div className="flex gap-6 border-b border-gray-200 mb-4">
                  {descriptionSections.map((section) => (
                    <button
                      key={section.title}
                      onClick={() => setActiveTab(section.title)}
                      className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                        (activeSection?.title ?? "") === section.title
                          ? "text-indigo-600 border-indigo-600"
                          : "text-gray-500 border-transparent hover:text-gray-700"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
                {activeSection && (
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 leading-relaxed">
                    {activeSection.paragraphs.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <BookingSidebar
            selectedRate={selectedRate}
            checkin={activeSearch.checkin}
            checkout={activeSearch.checkout}
            checkInTime={hotelInfo.check_in_time}
            checkOutTime={hotelInfo.check_out_time}
            guests={activeSearch.guests}
            onEditRoom={() => setSelectedRate(null)}
            onEditDates={() => {
              document
                .getElementById("hotel-availability-bar")
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            onProceed={() => {
              if (!selectedRate || !id) return;
              const payment = selectedRate.rate.payment_types?.[0];
              const validImages = filterValidHotelImages(hotelInfo.images);
              setSelection({
                hotelId: id,
                bookHash: selectedRate.rate.book_hash,
                roomName:
                  selectedRate.rate.room_data_trans?.main_name ??
                  selectedRate.roomTypeName,
                hotelName: hotelInfo.name ?? "",
                hotelImage: validImages.length
                  ? resolveHotelImageUrl(validImages[0], "640x400")
                  : HOTEL_IMAGE_PLACEHOLDER,
                checkin: activeSearch.checkin,
                checkout: activeSearch.checkout,
                residency: activeSearch.residency,
                residencyLabel: activeSearch.residencyLabel,
                guests: activeSearch.guests,
                amount: payment?.show_amount,
                currency: payment?.show_currency_code,
              });
              navigate(`/hotels/${id}/booking`);
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default HotelDetail;
