import { useEffect, useRef, useState } from "react";
import { BOOKINGS } from "../../../constants";
import PageHeader from "@/components/PageHeader";
import SortSelect, { SortOption } from "@/components/SortSelect";
import PageContainer from "@/components/PageContainer";
import { BOOKING_STATUS_ENUM } from "@/types/booking.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMyBookingList } from "@/graphql/booking";
import BookingCard from './_component/BookingCard';
import NotFoundComponent from '@/components/NotFoundComponent';

const STATUS = [
  {
    name: "Active",
    id: "1",
  },
  {
    name: "Expired",
    id: "1",
  },
];

const SORT_OPTION: SortOption[] = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
];

const INIT_TAG_LIST: SortOption[] = [
  {
    label: "Paid",
    value: BOOKING_STATUS_ENUM.PAID,
  },
  {
    label: "Pending",
    value: BOOKING_STATUS_ENUM.PENDING,
  },
  {
    label: "Failed",
    value: BOOKING_STATUS_ENUM.FAILED,
  },
];

const total = BOOKINGS.length;

const Bookings = () => {
  const [sort, setSort] = useState("desc");
  const [status, setStatus] = useState<string>(BOOKING_STATUS_ENUM.PAID);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
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
    queryKey: ["bookings", { status, sort }],
    queryFn: fetchMyBookingList,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });

  const bookings = data?.pages.flatMap((p) => p.data) ?? [];

  const paginatedBookings = BOOKINGS.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      case "Near Expiry":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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

  return (
    <PageContainer>
      <PageHeader
        title="My Bookings"
        des="Measure your advertising ROI and report website traffic."
      />
      <div className="flex items-center justify-between mb-5 gap-4 border border-[#21212124] py-[8px] px-[16px]">
        <SortSelect
          options={INIT_TAG_LIST}
          value={status}
          onChange={setStatus}
          label="Status:"
        />
        <SortSelect options={SORT_OPTION} value={sort} onChange={setSort} />
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
};

export default Bookings;
