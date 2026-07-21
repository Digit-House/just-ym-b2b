import { useEffect, useState } from "react";
import {
  differenceInCalendarDays,
  format,
  parseISO,
  startOfDay,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Users,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { HotelGuestInput } from "@/types/hotel.type";
import { useDateRangeDraft } from "../../useDateRangeDraft";
import { useGuestsDraft } from "../../useGuestsDraft";
import { NATIONALITIES } from "../../nationalities";

export type AvailabilitySearch = {
  checkin: string;
  checkout: string;
  residency: string;
  residencyLabel: string;
  guests: HotelGuestInput[];
};

type Props = AvailabilitySearch & {
  loading?: boolean;
  onSearch: (params: AvailabilitySearch) => void;
};

const AvailabilityBar = ({
  checkin: initialCheckin,
  checkout: initialCheckout,
  residency: initialResidency,
  residencyLabel: initialResidencyLabel,
  guests: initialGuests,
  loading,
  onSearch,
}: Props) => {
  const [checkin, setCheckin] = useState(initialCheckin);
  const [checkout, setCheckout] = useState(initialCheckout);
  const [residency, setResidency] = useState(initialResidency);
  const [residencyLabel, setResidencyLabel] = useState(initialResidencyLabel);
  const [guests, setGuests] = useState(initialGuests);

  // `useState(initialX)` only seeds on mount — without this, the bar goes stale whenever
  // the parent's committed search changes from somewhere other than this component itself
  // (e.g. navigating back into an already-mounted detail page with a different guest count).
  useEffect(() => {
    setCheckin(initialCheckin);
    setCheckout(initialCheckout);
    setResidency(initialResidency);
    setResidencyLabel(initialResidencyLabel);
    setGuests(initialGuests);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialCheckin,
    initialCheckout,
    initialResidency,
    initialResidencyLabel,
    initialGuests,
  ]);

  const [dateOpen, setDateOpen] = useState(false);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const { draftRange, seedDraft, clearDraft, handleSelect } = useDateRangeDraft(
    {
      onCommit: (ci, co) => {
        setCheckin(ci);
        setCheckout(co);
        setDateOpen(false);
      },
    }
  );

  const guestsDraft = useGuestsDraft({
    guests,
    open: guestsOpen,
    onCommit: (g) => {
      setGuests(g);
      setGuestsOpen(false);
    },
  });

  const hasDates = !!checkin && !!checkout;
  const checkinDate = hasDates ? parseISO(checkin) : new Date();
  const checkoutDate = hasDates ? parseISO(checkout) : new Date();

  const totalAdults = guests.reduce((s, r) => s + r.adults, 0);
  const totalChildren = guests.reduce((s, r) => s + r.children.length, 0);
  const guestsSummary =
    totalChildren > 0
      ? `${totalAdults} adult${totalAdults !== 1 ? "s" : ""}, ${totalChildren} child${totalChildren !== 1 ? "ren" : ""}`
      : `${totalAdults} adult${totalAdults !== 1 ? "s" : ""}`;

  const fieldTrigger =
    "w-full flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-left hover:border-gray-300 transition-colors";
  const fieldLabel =
    "text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <p className="text-sm font-bold text-gray-900 mb-4">Availability</p>
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
        {/* Check-in / Check-out (combined, per Figma) */}
        <div className="flex-1 min-w-0">
          <p className={fieldLabel}>Check-in</p>
          <Popover
            open={dateOpen}
            onOpenChange={(open) => {
              setDateOpen(open);
              if (open) seedDraft(checkinDate, checkoutDate);
            }}
          >
            <PopoverTrigger asChild>
              <button type="button" className={fieldTrigger}>
                <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate text-sm font-medium text-gray-700">
                  {hasDates
                    ? `${format(checkinDate, "d MMM")} - ${format(checkoutDate, "d MMM")}`
                    : "Add dates"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <CalendarIcon className="w-4 h-4 text-indigo-600" />
                  Select dates
                </p>
                {draftRange?.from && draftRange?.to && (
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {differenceInCalendarDays(draftRange.to, draftRange.from)}{" "}
                    night
                    {differenceInCalendarDays(
                      draftRange.to,
                      draftRange.from
                    ) !== 1
                      ? "s"
                      : ""}
                  </span>
                )}
              </div>
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={draftRange}
                disabled={{ before: startOfDay(new Date()) }}
                onSelect={handleSelect}
              />
              <div className="flex items-center justify-end px-4 py-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={clearDraft}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Nationality */}
        <div className="flex-1 min-w-0">
          <p className={fieldLabel}>Nationality</p>
          <Popover open={nationalityOpen} onOpenChange={setNationalityOpen}>
            <PopoverTrigger asChild>
              <button type="button" className={`${fieldTrigger} justify-between`}>
                <span className="truncate text-sm font-medium text-gray-700">
                  {residencyLabel || "Select nationality"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search nationality..." />
                <CommandList>
                  <CommandEmpty>No country found</CommandEmpty>
                  <CommandGroup>
                    {NATIONALITIES.map((n) => (
                      <CommandItem
                        key={n.code}
                        value={n.name}
                        onSelect={() => {
                          setResidency(n.code);
                          setResidencyLabel(n.name);
                          setNationalityOpen(false);
                        }}
                        className="flex items-center justify-between"
                      >
                        {n.name}
                        {n.code === residency && <Check className="w-4 h-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className="flex-1 min-w-0">
          <p className={fieldLabel}>Guests</p>
          <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
            <PopoverTrigger asChild>
              <button type="button" className={fieldTrigger}>
                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate text-sm font-medium text-gray-700">
                  {guestsSummary}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] p-4" align="start">
              <div className="flex flex-col gap-0">
                {guestsDraft.draftRooms.map((room, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-indigo-600">
                        Room {i + 1}
                      </span>
                      {guestsDraft.draftRooms.length > 1 && (
                        <button
                          onClick={() => guestsDraft.removeRoom(i)}
                          className="text-sm text-red-500 underline hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-800">
                        Adults
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          disabled={room.adults <= 1}
                          onClick={() => guestsDraft.updateRoomAdults(i, -1)}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:border-gray-400 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-5 text-sm font-bold text-center">
                          {room.adults}
                        </span>
                        <button
                          onClick={() => guestsDraft.updateRoomAdults(i, 1)}
                          className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-800">
                          Children
                        </span>
                        <p className="text-xs text-gray-400">
                          Ages at check-out
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          disabled={room.childAges.length <= 0}
                          onClick={() =>
                            guestsDraft.setRoomChildrenCount(
                              i,
                              room.childAges.length - 1
                            )
                          }
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:border-gray-400 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-5 text-sm font-bold text-center">
                          {room.childAges.length}
                        </span>
                        <button
                          onClick={() =>
                            guestsDraft.setRoomChildrenCount(
                              i,
                              room.childAges.length + 1
                            )
                          }
                          className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>

                    {room.childAges.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {room.childAges.map((age, ci) => (
                          <Select
                            key={ci}
                            value={age !== null ? String(age) : ""}
                            onValueChange={(val) =>
                              guestsDraft.setChildAge(i, ci, Number(val))
                            }
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue
                                placeholder={`Child ${ci + 1} age *`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 17 }).map((_, j) => (
                                <SelectItem key={j + 1} value={String(j + 1)}>
                                  {`${j + 1} year${j + 1 > 1 ? "s" : ""}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ))}
                      </div>
                    )}

                    {i < guestsDraft.draftRooms.length - 1 && (
                      <div className="border-t border-dashed border-gray-200 my-4" />
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
                  <button
                    onClick={guestsDraft.addRoom}
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Room
                  </button>
                  <button
                    onClick={guestsDraft.commit}
                    disabled={!guestsDraft.hasAllChildAges}
                    className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Done
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          size="lg"
          disabled={!hasDates || loading}
          onClick={() =>
            onSearch({ checkin, checkout, residency, residencyLabel, guests })
          }
          className="shrink-0"
        >
          {loading ? "Checking..." : "Check Availability"}
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityBar;
