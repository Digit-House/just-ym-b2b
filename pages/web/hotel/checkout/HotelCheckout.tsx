import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import ImageFallback from "@/components/ImageFallback";
import { Button } from "@/components/ui/button";
import {
  createHotelReservation,
  HOTEL_IMAGE_PLACEHOLDER,
} from "@/graphql/hotel";
import { useHotelBookingStore } from "@/store/useHotelBookingStore";
import { getErrMsg } from "@/util/initData";
import { CreateEtgHotelReservationInputT } from "@/types/hotel.type";
import { useUser } from "@/provider/UserProvider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useWalletStore } from "@/store/useWalletStore";
import Model from "../../cart/checkout/_components/Model";

const HotelCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selection,
    contactInfo,
    guestNames,
    specialRequests,
    setLastReservation,
  } = useHotelBookingStore();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { creditInfo, spend } = useWalletStore();
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [codeError, setCodeError] = useState("");

  // Nothing to check out (direct visit, cleared store, or skipped a step) — send back
  // to wherever the guest can pick that step up again.
  useEffect(() => {
    if (!selection || !contactInfo || guestNames.length === 0) {
      navigate(id ? `/hotels/${id}/booking` : "/hotels", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, contactInfo, guestNames]);

  if (!selection || !contactInfo || guestNames.length === 0) return null;

  const totalAdults = selection.guests.reduce((s, r) => s + r.adults, 0);
  const totalChildren = selection.guests.reduce(
    (s, r) => s + r.children.length,
    0,
  );

  const handleCheckout = async () => {
    if (user?.type === "OWNER" && user.twoFactorEnabled && code.length !== 6) {
      setCodeError("Please enter a valid 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const rooms = guestNames.map((room) => ({
        guests: room.map((g) => ({
          first_name: g.firstName,
          last_name: g.lastName,
          ...(g.age !== null ? { age: g.age, is_child: true } : {}),
        })),
      }));

      const commentParts: string[] = [];
      if (contactInfo.arrivalTime)
        commentParts.push(`Arrival time: ${contactInfo.arrivalTime}`);
      if (specialRequests)
        commentParts.push(`Special requests: ${specialRequests}`);

      const input: CreateEtgHotelReservationInputT = {
        book_hash: selection.bookHash,
        checkin: selection.checkin,
        checkout: selection.checkout,
        language: "en",
        returnUri: `${window.location.origin}/hotels/booking/confirmation`,
        rooms,
        user: {
          email: contactInfo.email,
          phone: contactInfo.phone,
          comment: commentParts.join(" | ") || undefined,
        },
        twoFactorCode:
          user?.type === "OWNER" && user.twoFactorEnabled ? code : null,
      };

      const res = await createHotelReservation(input);
      if (res.reservation) {
        setLastReservation(res.reservation);
        if (user?.type !== "OWNER") {
          spend(Number(selection.amount ?? 0));
        }
        toast.success("Reservation created successfully");
        navigate(`/hotels/booking/confirmation/${res.reservation.id}`);
      } else {
        toast.error("Failed to create reservation");
      }
    } catch (err: any) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  console.log("HotelCheckout selection:", selection.hotelImage);

  return (
    <PageContainer>
      <BackBtn
        route={`/hotels/${selection.hotelId}/booking`}
        title="Back to Guest Info"
      />
      <PageHeader
        title="Checkout"
        des="Review your reservation and complete payment."
      />

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex flex-col flex-1 gap-6">
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
                {totalAdults} adult{totalAdults !== 1 ? "s" : ""}
                {totalChildren > 0 &&
                  `, ${totalChildren} child${totalChildren !== 1 ? "ren" : ""}`}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div>
              <p className="font-bold text-gray-900 mb-2">Contact</p>
              <div className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <p>
                  <span className="text-gray-400">Name: </span>
                  {contactInfo.name}
                </p>
                <p>
                  <span className="text-gray-400">Email: </span>
                  {contactInfo.email}
                </p>
                <p>
                  <span className="text-gray-400">Phone: </span>
                  {contactInfo.phone}
                </p>
                {contactInfo.nationalityLabel && (
                  <p>
                    <span className="text-gray-400">Nationality: </span>
                    {contactInfo.nationalityLabel}
                  </p>
                )}
                {contactInfo.arrivalTime && (
                  <p>
                    <span className="text-gray-400">Arrival: </span>
                    {contactInfo.arrivalTime}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="font-bold text-gray-900 mb-2">Guests</p>
              {guestNames.map((room, ri) => (
                <p key={ri} className="text-sm text-gray-600 mb-1">
                  <span className="text-gray-400">Room {ri + 1}: </span>
                  {room
                    .map(
                      (g) =>
                        `${g.firstName} ${g.lastName}${g.age !== null ? ` (${g.age}y)` : ""}`,
                    )
                    .join(", ")}
                </p>
              ))}
            </div>

            {specialRequests && (
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-gray-900 mb-1">Special Requests</p>
                <p className="text-sm text-gray-600">{specialRequests}</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="w-full space-y-6">
              {user?.type === "OWNER" && user.twoFactorEnabled && (
                <div className="space-y-4">
                  <p className="text-gray-500">
                    Enter the 6-digit code from your authenticator app to
                    complete setup.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm font-medium">
                      Authentication Code
                    </Label>
                    <Input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={code}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setCode(value);
                        if (value.length === 6) {
                          setCodeError("");
                        }
                      }}
                      placeholder="Enter 6-digit code"
                      className="text-center text-lg font-mono tracking-widest"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {codeError && (
                  <p className="text-red-500 text-sm font-medium">
                    {codeError}
                  </p>
                )}
                <Button
                  disabled={loading}
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    if (
                      Number(selection.amount ?? 0) >
                        (creditInfo?.balance ?? 0) &&
                      user?.type !== "OWNER"
                    ) {
                      setOpen(true);
                    } else {
                      handleCheckout();
                    }
                  }}
                >
                  {loading ? "Loading..." : "Checkout"}
                </Button>
              </div>

              <Model open={open} onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[340px] shrink-0 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit sticky top-20">
          <p className="font-bold text-gray-900 mb-4">Order Summary</p>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Room rate</span>
            <span>
              {selection.currency}{" "}
              {selection.amount
                ? Number(selection.amount).toLocaleString()
                : "—"}
            </span>
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>
              {selection.currency}{" "}
              {selection.amount
                ? Number(selection.amount).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default HotelCheckout;
