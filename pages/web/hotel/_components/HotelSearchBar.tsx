import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { differenceInCalendarDays, format, parseISO, startOfDay } from "date-fns";
import {
  Check,
  CalendarIcon,
  MapPin,
  Minus,
  Plus,
  Search,
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
import { useDebounce } from "@/hooks/useDebounce";
import { searchHotelDestinations } from "@/graphql/hotel";
import { HotelSearchState } from "@/types/hotel.type";
import { useDateRangeDraft } from "../useDateRangeDraft";
import { useGuestsDraft } from "../useGuestsDraft";
import { NATIONALITIES } from "../nationalities";

type Props = {
  search: HotelSearchState;
  setSearch: React.Dispatch<React.SetStateAction<HotelSearchState>>;
};

const HotelSearchBar = ({ search, setSearch }: Props) => {
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [destinationQuery, setDestinationQuery] = useState("");
  const debouncedDestinationQuery = useDebounce(destinationQuery, 400);

  const { draftRange, seedDraft, clearDraft, handleSelect } = useDateRangeDraft({
    onCommit: (checkin, checkout) => {
      setSearch((s) => ({ ...s, checkin, checkout }));
      setDateOpen(false);
    },
  });

  const guestsDraft = useGuestsDraft({
    guests: search.guests,
    open: guestsOpen,
    onCommit: (guests) => {
      setSearch((s) => ({ ...s, guests }));
      setGuestsOpen(false);
    },
  });

  const { data: suggestions, isFetching: isSuggesting } = useQuery({
    queryKey: ["hotelMulticomplete", debouncedDestinationQuery],
    queryFn: () => searchHotelDestinations(debouncedDestinationQuery),
    enabled: destinationOpen && debouncedDestinationQuery.trim().length >= 2,
    staleTime: 60_000,
  });

  const checkinDate = parseISO(search.checkin);
  const checkoutDate = parseISO(search.checkout);

  const totalAdults = search.guests.reduce((s, r) => s + r.adults, 0);
  const totalChildren = search.guests.reduce(
    (s, r) => s + r.children.length,
    0
  );
  const guestsSummary =
    totalChildren > 0
      ? `${totalAdults} adult${totalAdults !== 1 ? "s" : ""}, ${totalChildren} child${totalChildren !== 1 ? "ren" : ""}`
      : `${totalAdults} adult${totalAdults !== 1 ? "s" : ""}`;

  return (
    <div className="w-full mt-0 relative z-10 bg-gray-200 p-4">
      <div className="m-auto w-[95%] lg:w-[85%] flex flex-col md:flex-row items-stretch gap-3 bg-white rounded-2xl md:rounded-full border border-slate-100 shadow-sm p-2">
        {/* Destination */}
        <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex-[1.2_0_0] flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-slate-50 text-left transition-colors"
            >
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate text-sm font-medium text-slate-700">
                {search.destinationLabel || "Where are you going?"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search city or region..."
                value={destinationQuery}
                onValueChange={setDestinationQuery}
              />
              <CommandList>
                {debouncedDestinationQuery.trim().length < 2 && (
                  <CommandEmpty>Type at least 2 characters</CommandEmpty>
                )}
                {debouncedDestinationQuery.trim().length >= 2 &&
                  !isSuggesting &&
                  !suggestions?.regions?.length && (
                    <CommandEmpty>No destinations found</CommandEmpty>
                  )}
                {!!suggestions?.regions?.length && (
                  <CommandGroup heading="Destinations">
                    {suggestions.regions.map((region) => (
                      <CommandItem
                        key={region.id}
                        value={String(region.id)}
                        onSelect={() => {
                          setSearch((s) => ({
                            ...s,
                            regionId: region.id,
                            destinationLabel: region.country_name
                              ? `${region.name}, ${region.country_name}`
                              : region.name,
                          }));
                          setDestinationOpen(false);
                        }}
                      >
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {region.name}
                        {region.country_name && (
                          <span className="text-slate-400">
                            , {region.country_name}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="hidden md:block w-px bg-slate-100" />

        {/* Dates — trip.com-style: two labeled fields sharing one range calendar. */}
        <Popover
          open={dateOpen}
          onOpenChange={(open) => {
            setDateOpen(open);
            if (open) seedDraft(checkinDate, checkoutDate);
          }}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex-[1.6_0_0] flex items-stretch rounded-full hover:bg-slate-50 text-left transition-colors"
            >
              <span className="flex-1 flex flex-col justify-center px-4 py-1 min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Check-in
                </span>
                <span className="truncate text-sm font-medium text-slate-700">
                  {format(checkinDate, "EEE, d MMM")}
                </span>
              </span>
              <span className="w-px bg-slate-100 my-1.5" />
              <span className="flex-1 flex flex-col justify-center px-4 py-1 min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Check-out
                </span>
                <span className="truncate text-sm font-medium text-slate-700">
                  {format(checkoutDate, "EEE, d MMM")}
                </span>
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
                  {differenceInCalendarDays(draftRange.to, draftRange.from) !== 1
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

        <div className="hidden md:block w-px bg-slate-100" />

        {/* Nationality / residency */}
        <Popover open={nationalityOpen} onOpenChange={setNationalityOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-slate-50 text-left transition-colors"
            >
              <span className="truncate text-sm font-medium text-slate-700">
                {search.residencyLabel || "Nationality"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
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
                        setSearch((s) => ({
                          ...s,
                          residency: n.code,
                          residencyLabel: n.name,
                        }));
                        setNationalityOpen(false);
                      }}
                      className="flex items-center justify-between"
                    >
                      {n.name}
                      {n.code === search.residency && (
                        <Check className="w-4 h-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="hidden md:block w-px bg-slate-100" />

        {/* Guests */}
        <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-slate-50 text-left transition-colors"
            >
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate text-sm font-medium text-slate-700">
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
                      <p className="text-xs text-gray-400">Ages at check-out</p>
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
                            <SelectValue placeholder={`Child ${ci + 1} age *`} />
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

        <Button
          size="lg"
          className="rounded-full gap-2 shrink-0"
          disabled={!search.regionId}
          onClick={() => setDestinationOpen(false)}
        >
          <Search className="w-4 h-4" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default HotelSearchBar;
