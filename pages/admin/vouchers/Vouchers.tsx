import NotFoundComponent from "@/components/NotFoundComponent";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect, { SortOption } from "@/components/SortSelect";
import { fetchVoucherList } from "@/graphql/voucher";
import { VOUCHER_STATUS_ENUM } from "@/types/voucher.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import VoucherCard from "./_components/VoucherCard";
import { useNavigate } from "react-router-dom";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";

const SORT_OPTION: SortOption[] = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
];

const Vouchers = () => {
  const [sort, setSort] = useState("desc");
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

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
    queryKey: ["vouchers", { status, sort }],
    queryFn: fetchVoucherList,
    gcTime: 0,
    staleTime: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });

  const vouchers = data?.pages.flatMap((p) => p.data) ?? [];

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
        title="Vouchers"
        des="Create and manage discount vouchers for your customers"
        isButton
      />

      <div className="flex items-center justify-between my-10 gap-4 border border-[#21212124] py-2 px-4">
        <div className="flex items-center">
          <Select
            value={status === null ? "all" : status}
            onValueChange={(value) => {
              setStatus(value === "all" ? null : value);
            }}
          >
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value={VOUCHER_STATUS_ENUM.ACTIVE}>Active</SelectItem>
              <SelectItem value={VOUCHER_STATUS_ENUM.INACTIVE}>
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
          <SortSelect value={sort} options={SORT_OPTION} onChange={setSort} />
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

      {!isPending && !!vouchers.length && (
        <div className="grid gird-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map((data) => (
            <VoucherCard key={data.id} data={data} />
          ))}
        </div>
      )}

      {!vouchers.length && !isPending && (
        <NotFoundComponent message="No Vouchers found" />
      )}
    </PageContainer>
  );
};

export default Vouchers;
