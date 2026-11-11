"use client";
import { useEffect, useRef, useState } from "react";
import { Hotel, LayoutGrid, RotateCcw, Ticket } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SortSelect, { SortOption } from "@/components/SortSelect";
import PageContainer from "@/components/PageContainer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMyBookings } from "@/graphql/booking";
import BookingCard from "./_component/BookingCard";
import NotFoundComponent from "@/components/NotFoundComponent";
import { useDebounce } from "@/hooks/useDebounce";
import MainSearch from "@/components/MainSearch";

const SORT_OPTION: SortOption[] = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
];

const BUCKET_OPTIONS: SortOption[] = [
  { label: "All", value: "ALL" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const KIND_TAGS = [
  { label: "All", value: "ALL", icon: LayoutGrid },
  { label: "Tickets", value: "TICKET", icon: Ticket },
  { label: "Hotels", value: "HOTEL", icon: Hotel },
];

export default function Bookings() {
  const getStoredFilters = () => {
    const stored = localStorage.getItem("bookingFilters");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const storedFilters = getStoredFilters();

  const [sort, setSort] = useState(storedFilters?.sort || "desc");
  const [bucket, setBucket] = useState<string>(storedFilters?.bucket || "ALL");
  const [kind, setKind] = useState<string>(storedFilters?.kind || "ALL");
  const [search, setSearch] = useState(storedFilters?.search || "");

  const debouncedSearch = useDebounce(search, 2000);

  useEffect(() => {
    const filtersToStore = {
      sort,
      bucket,
      kind,
      search,
    };
    localStorage.setItem("bookingFilters", JSON.stringify(filtersToStore));
  }, [sort, bucket, kind, search]);

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
      "bookings",
      {
        bucket: bucket === "ALL" ? undefined : bucket,
        kind,
        sort,
        search: debouncedSearch,
      },
    ],
    queryFn: fetchMyBookings,
    gcTime: 0,
    staleTime: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });

  const bookings = data?.pages.flatMap((p) => p.data) ?? [];

  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage]);

  const handleResetFilters = () => {
    setSort("desc");
    setBucket("ALL");
    setKind("ALL");
    setSearch("");
    localStorage.removeItem("bookingFilters");
  };

  const filtersChanged =
    sort !== "desc" || bucket !== "ALL" || kind !== "ALL" || search !== "";

  return (
    <PageContainer>
      <PageHeader
        title="My Bookings"
        des="Measure your advertising ROI and report website traffic."
      />

      <MainSearch
        search={search}
        placeHolder="Search bookings..."
        onClick={(value: string) => {
          setSearch(value);
        }}
      />

      <div className="flex flex-wrap gap-2 mt-8" role="tablist">
        {KIND_TAGS.map(({ label, value, icon: Icon }) => {
          const active = kind === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setKind(value)}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                  : "border-[#21212124] bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 mb-10 gap-4 border border-[#21212124] py-2 px-4">
        <div className="flex flex-col md:flex-row gap-5 md:items-center">
          <SortSelect
            options={BUCKET_OPTIONS}
            value={bucket}
            onChange={setBucket}
            label="Show:"
          />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect value={sort} options={SORT_OPTION} onChange={setSort} />
          {filtersChanged && (
            <button
              onClick={handleResetFilters}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Reset filters"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>

      {isPending && (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              className="animate-pulse bg-white rounded-2xl shadow-sm border border-gray-100 h-20"
              key={i}
            ></div>
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-red-500 py-10">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      {!isPending && !!bookings.length && (
        <div className="flex flex-col gap-6 w-full">
          {bookings.map((data) => (
            <BookingCard key={data.id} data={data} />
          ))}
        </div>
      )}

      <div ref={loaderRef} className="h-10"></div>

      {hasNextPage && !isPending && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {!bookings.length && !isPending && (
        <NotFoundComponent message="No bookings found" />
      )}
    </PageContainer>
  );
}
