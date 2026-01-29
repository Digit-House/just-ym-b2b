"use client";

import { Fragment, useMemo, useState } from "react";
import { ArrowUpDown, RotateCcw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import Select from "@/components/Select";
import SortSelect, { SortOption } from "@/components/SortSelect";
import NotFoundComponent from "@/components/NotFoundComponent";
import SkeletonCard from "./_components/SkeletonCard";
import RecommendedTicketsSortDialog from "@/components/RecommendedTicketsSortDialog";

import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCategories } from "@/hooks/useCategories";
import { useCountries } from "@/hooks/useCountries";
import { useDebounce } from "@/hooks/useDebounce";
import { useUser } from "@/provider/UserProvider";
import { fetchProducts } from "@/graphql/product";
import { useTicketFilters } from "@/hooks/useTicketFilter";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import TicketCard from "./_components/TicketCard";
import MainSearch from "../../../components/MainSearch";

const SORT_OPTION: SortOption[] = [
  { label: "Alphabet", value: "alphabet" },
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
];

export default function Tickets() {
  const navigate = useNavigate();
  const { user } = useUser();

  const { filters, setFilters, resetFilters } = useTicketFilters();
  const debouncedSearch = useDebounce(filters.search, 500);

  const [sortDialogOpen, setSortDialogOpen] = useState(false);

  const { data: countryData } = useCountries({
    limit: 250,
    page: 1,
    orderBy: { dir: "asc" },
    isPublished: true,
    search: undefined,
  });

  const { data: categoryData } = useCategories({ limit: 10, page: 1 });

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
      "products",
      {
        categories: filters.categories,
        countries: filters.countries,
        sort: filters.sort,
        published: filters.published,
        search: debouncedSearch,
        isRecommended: filters.isRecommended,
      },
    ],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    staleTime: 0,
    gcTime: 0,
  });

  const products = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const loaderRef = useInfiniteScroll(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  );

  const showReset =
    filters.sort !== "desc" ||
    filters.published !== "PUBLISHED" ||
    filters.isRecommended !== null ||
    filters.categories.length ||
    filters.countries.length ||
    filters.search;

  const handleNavigate = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };

  return (
    <>
      <PageContainer className="w-full">
        <PageHeader
          title="Tickets"
          des="Measure your advertising ROI and report website traffic."
        />

        <MainSearch
          search={filters.search}
          placeHolder="Search tickets..."
          onClick={(value:string) => {
            setFilters((f) => ({ ...f, search: value }))
          }}
        />
       
        <div className="flex justify-between gap-4 mt-3 mb-10 border px-4 py-2">
          <div className="flex gap-5 items-center">
            <Select
              label="Categories"
              placeholder="Categories"
              options={categoryData}
              value={filters.categories}
              onChange={(v) => setFilters((f) => ({ ...f, categories: v }))}
              width="w-50"
            />

            <Select
              label="Countries"
              placeholder="Countries"
              options={countryData?.data}
              value={filters.countries}
              onChange={(v) => setFilters((f) => ({ ...f, countries: v }))}
              width="w-32"
            />
          </div>
          

          <div className="flex items-center gap-2">
            {user?.type === "OWNER" && (
              <Fragment>
                <ShadcnSelect
                  value={filters.published}
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, published: v as any }))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
                  </SelectContent>
                </ShadcnSelect>
                <ShadcnSelect
                  value={
                    filters.isRecommended ? "RECOMMENDED" : "NOT_RECOMMENDED"
                  }
                  onValueChange={(v) =>
                    setFilters((f) => ({
                      ...f,
                      isRecommended: v === "RECOMMENDED" ? true : false,
                    }))
                  }
                >
                  <SelectTrigger className="w-55">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECOMMENDED">Recommended</SelectItem>
                    <SelectItem value="NOT_RECOMMENDED">
                      Not Recommended (ALL)
                    </SelectItem>
                  </SelectContent>
                </ShadcnSelect>
              </Fragment>
            )}
            <SortSelect
              value={filters.sort}
              options={SORT_OPTION}
              onChange={(v) => setFilters((f) => ({ ...f, sort: v }))}
            />

            {showReset && (
              <button onClick={resetFilters} title="Reset filters">
                <RotateCcw size={18} />
              </button>
            )}
            {user.type === "OWNER" && (
              <button
                onClick={() => {
                  setSortDialogOpen(true);
                }}
                title="Reset filters"
              >
                <ArrowUpDown size={18} />
              </button>
            )}
          </div>
          
        </div>

        <p className="flex gap-2 items-center justify-end text-sm w-full">Total : <p>{products.length}</p></p>   

        {isPending && (
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-red-500 py-10">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        )}

        {!isPending && !!products.length && (
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <TicketCard user={user} key={p.id} p={p} handleNavigate={handleNavigate} />
            ))}
          </div>
        )}

        <div ref={loaderRef} className="h-10" />

        {!products.length && !isPending && (
          <NotFoundComponent message="No products found" />
        )}
      </PageContainer>
      {sortDialogOpen && (
        <RecommendedTicketsSortDialog
          open={sortDialogOpen}
          onOpenChange={setSortDialogOpen}
        />
      )}
    </>
  );
}
