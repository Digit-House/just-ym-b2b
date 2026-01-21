"use client";
import { useRef, useEffect, useState} from "react";
import { ArrowRight, RotateCcw, Search } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useCountries } from "@/hooks/useCountries";
import PageHeader from "@/components/PageHeader";
import Select from "@/components/Select";
import SortSelect, { SortOption } from "@/components/SortSelect";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/graphql/product";
import SkeletonCard from "./_components/SkeletonCard";
import { preFixImg } from "@/util/initData";
import PageContainer from "@/components/PageContainer";
import { useUser } from "@/provider/UserProvider";
import NotFoundComponent from '@/components/NotFoundComponent';
import ImageFallback from '@/components/ImageFallback';
import { truncateDescription } from "@/lib/utils";

const SORT_OPTION: SortOption[] = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
];

export default function Tickets() {
  const navigate = useNavigate();

  // Initialize state from localStorage only
  const getStoredFilters = () => {
    const stored = localStorage.getItem('ticketFilters');
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
  
  // Use localStorage or defaults only
  const initialSort = storedFilters?.sort || 'desc';
  const initialPublished = (storedFilters?.published as "ALL" | "PUBLISHED" | "UNPUBLISHED") || 
                          "PUBLISHED";
  
  const [sort, setSort] = useState(initialSort);
  const { user } = useUser();

  const [published, setPublished] = useState<
    "ALL" | "PUBLISHED" | "UNPUBLISHED"
  >(initialPublished);
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 2000); // 2 second debounce
  
  const [categories, setCategories] = useState<string[]>(
    storedFilters?.categories || []
  );
  const [countries, setCountries] = useState<string[]>(
    storedFilters?.countries || []
  );

  useEffect(() => {
    const filtersToStore = {
      sort,
      published,
      categories,
      countries,
      search
    };
    localStorage.setItem('ticketFilters', JSON.stringify(filtersToStore));
  }, [sort, published, categories, countries, search]);

  const { data: dataCountry } = useCountries({
    limit: 250,
    page: 1,
    orderBy: {
      dir: "asc",
    },
    isPublished: true,
    search: undefined,
  });

  const COUNTRIES = dataCountry?.data;
  const { data: CATEGORIES } = useCategories({ limit: 10, page: 1 });

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
    queryKey: ["products", { categories, countries, sort, published, search: debouncedSearch }],
    queryFn: fetchProducts,
    gcTime: 0,
    staleTime: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });

  const products = data?.pages.flatMap((p) => p.data) ?? [];

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
        title="Tickets"
        des="Measure your advertising ROI and report website traffic."
      />

      <div className="flex items-center justify-between my-10 gap-4 border border-[#21212124] py-[8px] px-[16px]">
        <div className="flex gap-5 items-center">
          <Select
            label="Categories"
            placeholder="Categories"
            options={CATEGORIES}
            value={categories}
            onChange={setCategories}
            width="w-32"
          />
          <Select
            label="Countries"
            placeholder="Countries"
            options={COUNTRIES}
            value={countries}
            onChange={setCountries}
            width="w-32"
          />
          <div className="relative">
            <Search className="absolute left-3 top-[26px] transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48 text-sm"
            />
            {search && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                Searching...
              </div>
            )}
          </div>
          {user?.type === "OWNER" && (
            <ShadcnSelect
              value={published}
              onValueChange={(value) =>
                setPublished(value as "ALL" | "PUBLISHED" | "UNPUBLISHED")
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
          )}
        </div>
        <div className="flex items-center gap-2">
          <SortSelect value={sort} options={SORT_OPTION} onChange={setSort} />
          {(sort !== 'desc' || published !== 'PUBLISHED' || categories.length > 0 || countries.length > 0) && (
            <button
              onClick={() => {
                setSort('desc');
                setPublished('PUBLISHED');
                setCategories([]);
                setCountries([]);
                setSearch('');
                // Clear localStorage when resetting
                localStorage.removeItem('ticketFilters');
              }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Reset filters"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="h-48 overflow-hidden relative">
                <ImageFallback
                  src={preFixImg(p.image)}
                  alt={p.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {truncateDescription(p.description)}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    // Simple direct navigation
                    navigate(`/tickets/${p.id}`);
                  }}
                  className="flex items-center text-indigo-600 text-sm font-medium mb-6 hover:text-indigo-800 transition-colors"
                >
                  Read More <ArrowRight size={16} className="ml-1" />
                </button>

                <div className="mt-auto flex items-center justify-between">
                  {/* <div>
                    <p className="text-xs text-gray-500">Special Price</p>
                    <p className="text-lg font-bold text-gray-900">
                      THB {p?.price?.toFixed(2) || "0.00"}
                    </p>
                  </div> */}
                  <div className="flex gap-2">
                    {user?.type === "OWNER" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          
                          // Simple direct navigation
                          navigate(`/admin-tickets/edit/${p.id}`);
                        }}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {user?.type !== "OWNER" && (
                      <button
                        onClick={(e) => {
                        }}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
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

      {!products.length && !isPending && (
        <NotFoundComponent message="No products found" />
      )}
    </PageContainer>
  );
}
