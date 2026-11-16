import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { differenceInCalendarDays, parseISO } from "date-fns";

import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import TicketStubsLoader from "@/components/TicketStubsLoader";

import { fetchHotelsByRegion, HOTEL_SEARCH_PAGE_LIMIT } from "@/graphql/hotel";
import { useHotelSearch } from "./useHotelSearch";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import HotelSearchBar from "./_components/HotelSearchBar";
import HotelFilters from "./_components/HotelFilters";
import HotelCard from "./_components/HotelCard";
import SelectedHotelCard from "./_components/SelectedHotelCard";
import {
  SearchError,
  SearchPageLoader,
} from "./_components/HotelSearchStates";

export default function Hotels() {
  const navigate = useNavigate();
  const { search, setSearch, resetFilters } = useHotelSearch();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [
      "hotelSearchByRegion",
      {
        regionId: search.regionId,
        checkin: search.checkin,
        checkout: search.checkout,
        guests: search.guests,
        residency: search.residency,
        starRating: search.starRating,
        mealType: search.mealType,
        freeCancellationOnly: search.freeCancellationOnly,
        priceFrom: search.priceFrom,
        priceTo: search.priceTo,
        sort: search.sort,
      },
    ],
    queryFn: fetchHotelsByRegion,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    enabled: !!search.regionId,
    staleTime: 0,
    gcTime: 0,
  });

  const nights = Math.max(
    1,
    differenceInCalendarDays(
      parseISO(search.checkout),
      parseISO(search.checkin),
    ) || 1,
  );

  const total = data?.pages[0]?.total_hotels || 0;
  // A hotel picked in the search box gets its own card above the grid (taken out of it when it's in the results).
  const pinnedId = search.selectedHotel?.id ?? null;
  const hotels = useMemo(
    () => data?.pages.flatMap((p) => p.hotels) ?? [],
    [data],
  );
  const pinnedHotel = pinnedId
    ? (hotels.find((h) => h.id === pinnedId) ?? null)
    : null;
  const gridHotels = pinnedHotel
    ? hotels.filter((h) => h.id !== pinnedId)
    : hotels;
  // "Bangkok, Thailand" -> "Bangkok" for the loader's bubble.
  const city = search.destinationLabel.split(",")[0].trim();

  const loaderRef = useInfiniteScroll(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  );

  const showReset =
    search.sort !== "price_asc" ||
    search.starRating.length > 0 ||
    search.mealType.length > 0 ||
    search.freeCancellationOnly ||
    !!search.priceFrom ||
    !!search.priceTo;

  const handleNavigate = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path, {
      state: {
        checkin: search.checkin,
        checkout: search.checkout,
        guests: search.guests,
        residency: search.residency,
        residencyLabel: search.residencyLabel,
      },
    });
  };

  const searching = !!search.regionId;
  const hasResults = searching && !isPending && !isError && !!hotels.length;

  return (
    <PageContainer className="w-full">
      <PageHeader
        title="Hotels"
        des="Search live hotel availability and manage bookings."
      />

      <HotelSearchBar search={search} setSearch={setSearch} />

      <HotelFilters
        search={search}
        setSearch={setSearch}
        onReset={resetFilters}
        showReset={showReset}
      />

      <p className="text-sm font-medium text-gray-600 mb-6">
        {!searching ? (
          "Choose a destination to start searching."
        ) : isPending ? (
          "Searching hotels..."
        ) : (
          <>
            Total Hotels : <span className="font-bold text-gray-900">{total}</span>
          </>
        )}
      </p>

      {searching && isPending && <SearchPageLoader city={city} />}

      {searching && isError && (
        <SearchError retrying={isFetching} onRetry={() => refetch()} />
      )}

      {/* The hotel picked in the search box: its own horizontal card, out of the grid. While the search runs it
          sits under the mascot with the price loader. */}
      {search.selectedHotel && searching && !isError && (
        <SelectedHotelCard
          hotel={search.selectedHotel}
          data={pinnedHotel}
          pricePending={isPending}
          noRooms={!isPending && !pinnedHotel && !hasNextPage}
          nights={nights}
          handleNavigate={handleNavigate}
        />
      )}

      {hasResults && !!gridHotels.length && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gridHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              handleNavigate={handleNavigate}
              nights={nights}
            />
          ))}
        </div>
      )}

      <div ref={loaderRef} className="h-4" />

      {isFetchingNextPage && (
        <TicketStubsLoader
          label={`Loading the next ${HOTEL_SEARCH_PAGE_LIMIT}…`}
        />
      )}

      {hasResults && !hasNextPage && (
        <p className="py-4 text-center text-sm text-gray-400">
          You've seen all hotels
        </p>
      )}

      {searching && !isPending && !isError && !hotels.length && (
        <EmptyState
          className="py-16"
          title="No hotels found"
          description="Try adjusting your filters or search criteria"
        >
          {showReset && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
            >
              Clear all filters
            </button>
          )}
        </EmptyState>
      )}
    </PageContainer>
  );
}
