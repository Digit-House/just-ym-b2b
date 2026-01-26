"use client";

import { Fragment, useMemo, useState } from "react";
import { ArrowRight, RotateCcw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import Select from "@/components/Select";
import SortSelect, { SortOption } from "@/components/SortSelect";
import NotFoundComponent from "@/components/NotFoundComponent";
import ImageFallback from "@/components/ImageFallback";
import SkeletonCard from "./_components/SkeletonCard";

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
import { preFixImg } from "@/util/initData";
import { truncateDescription } from "@/lib/utils";
import { useTicketFilters } from "@/hooks/useTicketFilter";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const SORT_OPTION: SortOption[] = [
  { label: "Alphabet", value: "alphabet" },
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
];

export default function Tickets() {
  const navigate = useNavigate();
  const { user } = useUser();

  const { filters, setFilters, resetFilters } = useTicketFilters();
  const debouncedSearch = useDebounce(filters.search, 2000);

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
    <PageContainer>
      <PageHeader
        title="Tickets"
        des="Measure your advertising ROI and report website traffic."
      />

      {/* Filters */}
      <div className="flex justify-between gap-4 my-10 border px-4 py-2">
        <div className="flex gap-5 items-center">
          <Select
            label="Categories"
            placeholder="Categories"
            options={categoryData?.data}
            value={filters.categories}
            onChange={(v) => setFilters((f) => ({ ...f, categories: v }))}
            width="w-32"
          />

          <Select
            label="Countries"
            placeholder="Countries"
            options={countryData?.data}
            value={filters.countries}
            onChange={(v) => setFilters((f) => ({ ...f, countries: v }))}
            width="w-32"
          />

          <div className="relative">
            <Search className="absolute left-3 top-[26px] -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              placeholder="Search tickets..."
              className="pl-10 pr-4 py-2 border rounded-md w-72 text-sm"
            />
          </div>

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
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Content */}
      {isPending && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <ImageFallback
                  src={preFixImg(p.image)}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col">
                <h3 className="font-bold line-clamp-1">{p.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {truncateDescription(p.description)}
                </p>

                <button
                  onClick={(e) => handleNavigate(e, `/tickets/${p.id}`)}
                  className="flex items-center text-indigo-600 text-sm font-medium mb-6 hover:text-indigo-800 transition-colors"
                >
                  Read More <ArrowRight size={16} className="ml-1" />
                </button>

                <div className="mt-auto flex items-center gap-2">
                  {user?.type === "OWNER" && (
                    <button
                      onClick={(e) =>
                        handleNavigate(e, `/admin-tickets/edit/${p.id}`)
                      }
                      className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {p.isPublished && (
                    <button
                      onClick={(e) => handleNavigate(e, `/tickets/${p.id}`)}
                      className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={loaderRef} className="h-10" />

      {!products.length && !isPending && (
        <NotFoundComponent message="No products found" />
      )}
    </PageContainer>
  );
}
