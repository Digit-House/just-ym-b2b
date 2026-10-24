import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import NotFoundComponent from "@/components/NotFoundComponent";

import { fetchHotelsByRegion } from "@/graphql/hotel";
import { useHotelSearch } from "./useHotelSearch";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import HotelSearchBar from "./_components/HotelSearchBar";
import HotelFilters from "./_components/HotelFilters";
import HotelCard from "./_components/HotelCard";
import SkeletonCard from "./_components/SkeletonCard";

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
    error,
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

  const total = data?.pages[0]?.total_hotels || 0;
  const hotels = useMemo(
    () => data?.pages.flatMap((p) => p.hotels) ?? [],
    [data]
  );

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
        {search.regionId ? (
          <>
            Total Hotels : <span className="font-bold text-gray-900">{total}</span>
          </>
        ) : (
          "Choose a destination to start searching."
        )}
      </p>

      {isPending && !!search.regionId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-red-500 py-10">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      {!isPending && !!hotels.length && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              handleNavigate={handleNavigate}
            />
          ))}
        </div>
      )}

      <div ref={loaderRef} className="h-10" />

      {!!search.regionId && !hotels.length && !isPending && (
        <NotFoundComponent message="No hotels found for these dates" />
      )}
    </PageContainer>
  );
}
