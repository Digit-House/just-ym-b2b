import { useEffect, useState } from "react";
import PreviewFormFrame from "@/pages/web/ticket/userInfo/_component.tsx/PreviewFormFrame";
import { CART_ICON_ENUM } from "@/types/product.type";
import { Button } from "@/components/ui/button";
import { useHotelBookingStore } from "@/store/useHotelBookingStore";
import { HotelBookingGuestT, HotelGuestInput } from "@/types/hotel.type";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  guests: HotelGuestInput[];
  roomName: string;
  onDone: () => void;
};

type GuestErrors = Record<
  number,
  Record<number, { firstName?: string; lastName?: string }>
>;

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const toGuestNames = (guests: HotelGuestInput[]): HotelBookingGuestT[][] =>
  guests.map((r) => [
    ...Array.from({ length: r.adults }, () => ({
      firstName: "",
      lastName: "",
      age: null,
    })),
    ...r.children.map((age) => ({ firstName: "", lastName: "", age })),
  ]);

const GuestInfoSection = ({ open, setOpen, guests, roomName, onDone }: Props) => {
  const { guestNames: storedGuestNames, setGuestNames } = useHotelBookingStore();

  const [localGuestNames, setLocalGuestNames] = useState<
    HotelBookingGuestT[][]
  >(() =>
    storedGuestNames.length === guests.length
      ? storedGuestNames
      : toGuestNames(guests)
  );
  const [errors, setErrors] = useState<GuestErrors>({});

  // Reset if the room/guest composition changes (e.g. a fresh search from the detail
  // page selected a different number of rooms/guests) — otherwise this stays seeded
  // from whatever shape it had on mount.
  useEffect(() => {
    setLocalGuestNames((prev) =>
      prev.length === guests.length ? prev : toGuestNames(guests)
    );
  }, [guests]);

  // Persist as the guest types, not just on "Save & Continue" — otherwise navigating
  // away mid-form (or the section re-rendering) silently drops everything typed so far.
  useEffect(() => {
    setGuestNames(localGuestNames);
  }, [localGuestNames, setGuestNames]);

  const updateGuest = (
    roomIdx: number,
    personIdx: number,
    field: "firstName" | "lastName",
    value: string
  ) => {
    setLocalGuestNames((prev) =>
      prev.map((room, ri) =>
        ri !== roomIdx
          ? room
          : room.map((g, pi) =>
              pi !== personIdx ? g : { ...g, [field]: value }
            )
      )
    );
    setErrors((prev) => {
      if (!prev[roomIdx]?.[personIdx]?.[field]) return prev;
      return {
        ...prev,
        [roomIdx]: {
          ...prev[roomIdx],
          [personIdx]: { ...prev[roomIdx][personIdx], [field]: undefined },
        },
      };
    });
  };

  const handleSubmit = () => {
    const nextErrors: GuestErrors = {};
    let valid = true;
    localGuestNames.forEach((room, ri) => {
      room.forEach((guest, pi) => {
        const fieldErrors: { firstName?: string; lastName?: string } = {};
        if (!guest.firstName.trim()) {
          fieldErrors.firstName = "First name is required";
          valid = false;
        }
        if (!guest.lastName.trim()) {
          fieldErrors.lastName = "Last name is required";
          valid = false;
        }
        if (Object.keys(fieldErrors).length) {
          nextErrors[ri] = { ...nextErrors[ri], [pi]: fieldErrors };
        }
      });
    });
    setErrors(nextErrors);
    if (!valid) return;

    setGuestNames(localGuestNames);
    onDone();
  };

  return (
    <PreviewFormFrame
      title="Guest Information"
      iconName={CART_ICON_ENUM.GUEST}
      open={open}
      setOpen={setOpen}
    >
      <div className="flex flex-col w-full gap-6 px-8 py-6">
        {guests.map((room, roomIdx) => (
          <div key={roomIdx}>
            <p className="mb-4 text-sm font-bold text-gray-900">
              {roomName || `Room ${roomIdx + 1}`} for {room.adults} adult
              {room.adults !== 1 ? "s" : ""}
              {room.children.length > 0 &&
                ` and ${room.children.length} child${room.children.length !== 1 ? "ren" : ""}`}
            </p>

            <div className="flex flex-col gap-5">
              {localGuestNames[roomIdx]?.map((guest, personIdx) => {
                const isChild = personIdx >= room.adults;
                const showBadge = personIdx > 0 || isChild;
                const label = isChild
                  ? `Child ${personIdx - room.adults + 1} (${guest.age === 0 ? "Under 1 year" : `${guest.age} year${(guest.age ?? 0) > 1 ? "s" : ""}`})`
                  : `The ${ordinal(personIdx + 1)} guest`;

                return (
                  <div key={personIdx} className="flex flex-col gap-3">
                    {showBadge && (
                      <div className="relative flex items-center justify-center w-full">
                        <span className="px-3 z-10 py-1 text-xs font-semibold rounded-sm bg-amber-200 text-amber-900">
                          {label}
                        </span>
                        <div className="absolute top-1/2 left-0 w-full border-t border-gray-100 -translate-y-1/2" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex gap-x-1">
                          <p className="text-sm">First Name</p>
                          <span className="text-red-500">*</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter first name"
                          value={guest.firstName}
                          onChange={(e) =>
                            updateGuest(
                              roomIdx,
                              personIdx,
                              "firstName",
                              e.target.value
                            )
                          }
                          className={`h-10 border rounded-md px-3 text-sm outline-none focus:ring-1 transition-colors ${
                            errors[roomIdx]?.[personIdx]?.firstName
                              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
                        />
                        {errors[roomIdx]?.[personIdx]?.firstName && (
                          <p className="text-xs text-red-500">
                            {errors[roomIdx][personIdx].firstName}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex gap-x-1">
                          <p className="text-sm">Last Name</p>
                          <span className="text-red-500">*</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter last name"
                          value={guest.lastName}
                          onChange={(e) =>
                            updateGuest(
                              roomIdx,
                              personIdx,
                              "lastName",
                              e.target.value
                            )
                          }
                          className={`h-10 border rounded-md px-3 text-sm outline-none focus:ring-1 transition-colors ${
                            errors[roomIdx]?.[personIdx]?.lastName
                              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
                        />
                        {errors[roomIdx]?.[personIdx]?.lastName && (
                          <p className="text-xs text-red-500">
                            {errors[roomIdx][personIdx].lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {roomIdx < guests.length - 1 && (
              <div className="mt-6 border-b border-gray-100" />
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <Button type="button" size="lg" onClick={handleSubmit}>
            Save & Continue
          </Button>
        </div>
      </div>
    </PreviewFormFrame>
  );
};

export default GuestInfoSection;
