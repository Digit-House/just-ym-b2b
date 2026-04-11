"use client";

import { Fragment, useMemo, useState } from "react";
import {
  ArrowUpDown,
  RotateCcw,
  DownloadIcon,
  LayersPlusIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
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
import {
  fetchProducts,
  exportProductsReport,
  ProductReportInput,
} from "@/graphql/product";
import { useTicketFilters } from "@/hooks/useTicketFilter";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import TicketCard from "./_components/TicketCard";
import MainSearch from "../../../components/MainSearch";
import MultiSelect from "@/components/MultiSelect";
import SingleSelect from "@/components/SingleSelect";
import { useCities } from "@/hooks/useCities";
import { toast } from "sonner";
import CreateNewProductDialog from "./_components/CreateNewProductDialog";

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
  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false);

  const { data: countryData } = useCountries({
    limit: 250,
    page: 1,
    orderBy: { dir: "asc" },
    isPublished: true,
    search: undefined,
  });

  const { data: cityData } = useCities({
    countryId: filters.countryId,
    limit: 250,
    page: 1,
    orderBy: {
      dir: "desc",
    },
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
        countryId: filters.countryId,
        cityId: filters.cityId,
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

  const total = data?.pages[0]?.total || 0;
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
    filters.countryId ||
    filters.cityId ||
    filters.search;

  const handleNavigate = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };

  const handleExportExcel = async () => {
    try {
      // Map the current filters to the export report input
      const exportData: ProductReportInput = {};

      // Map the published filter
      if (filters.published === "PUBLISHED") {
        exportData.isPublished = true;
      } else if (filters.published === "UNPUBLISHED") {
        exportData.isPublished = false;
      }

      // Add other applicable filters if needed
      if (filters.categories.length > 0) {
        // Note: We may need to adjust the backend to accept categoryIds in the export
      }

      const response = await exportProductsReport(exportData);

      // Create a blob from the base64 data
      const binaryData = atob(response.data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: response.contentType });
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = response.filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Tickets exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export tickets");
    }
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
          onClick={(value: string) => {
            setFilters((f) => ({ ...f, search: value }));
          }}
        />

        {/* --- UPDATED RESPONSIVE FILTER SECTION --- */}
        <div className="flex flex-col gap-4 mt-3 mb-6 border p-4 bg-white rounded-xl shadow-sm">
          {/* Row 1: Main Filters (Stack on mobile, Row on desktop) */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <MultiSelect
              label="Categories"
              placeholder="Categories"
              options={categoryData}
              value={filters.categories}
              onChange={(v) => setFilters((f) => ({ ...f, categories: v }))}
              width="w-full"
            />

            <SingleSelect
              label="Country"
              placeholder="Country"
              options={countryData?.data}
              value={filters.countryId}
              onChange={(v) =>
                setFilters((f) => ({ ...f, countryId: v, cityId: "" }))
              }
              width="w-full"
            />

            {filters.countryId && (
              <SingleSelect
                label="City"
                placeholder="City"
                options={cityData?.data || []}
                value={filters.cityId}
                onChange={(v) => setFilters((f) => ({ ...f, cityId: v }))}
                width="w-full"
              />
            )}
          </div>

          {/* Row 2: Sort, Status, Actions (Wrap on mobile, Row on desktop) */}
          <div className="flex flex-wrap items-center gap-3 w-full border-t border-gray-100 pt-4 md:border-none md:pt-0">
            {user?.type === "OWNER" && (
              <Fragment>
                <ShadcnSelect
                  value={filters.published}
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, published: v as any }))
                  }
                >
                  <SelectTrigger className="w-full md:w-48">
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
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECOMMENDED">Recommended</SelectItem>
                    <SelectItem value="NOT_RECOMMENDED">ALL</SelectItem>
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
              <button
                onClick={resetFilters}
                title="Reset filters"
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            )}

            {user.type === "OWNER" && (
              <button
                onClick={() => {
                  setSortDialogOpen(true);
                }}
                title="Manage Sort Order"
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              >
                <ArrowUpDown size={18} />
              </button>
            )}
          </div>
        </div>
        {/* --- END UPDATED SECTION --- */}

        {/* Total and Action Buttons Section */}
        <div
          className={`flex flex-col md:flex-row ${
            user?.type === "OWNER" ? "justify-between" : "justify-end"
          } items-start md:items-center mb-6 gap-4`}
        >
          <p className="text-sm font-medium text-gray-600">
            Total Tickets :{" "}
            <span className="font-bold text-gray-900">{total}</span>
          </p>

          {user?.type === "OWNER" && (
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={() => setNewProductDialogOpen(true)}
                className="w-full md:w-auto p-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm shadow-sm"
              >
                <LayersPlusIcon size={16} />
                <span>Create New Product</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="w-full md:w-auto p-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm shadow-sm"
              >
                <DownloadIcon size={16} />
                <span>Export Excel</span>
              </button>
            </div>
          )}
        </div>

        {isPending && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <TicketCard
                user={user}
                key={p.id}
                p={p}
                handleNavigate={handleNavigate}
              />
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
      {newProductDialogOpen && (
        <CreateNewProductDialog onOpenChange={setNewProductDialogOpen} />
      )}
    </>
  );
}
