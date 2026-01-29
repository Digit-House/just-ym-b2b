import { ProductT } from "@/types/product.type";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { useState, useEffect, useMemo, useCallback } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductInfo } from "@/graphql/product";
import useRelatedTicketFilters from "@/hooks/useRelatedTicketFilters";
import { useDebounce } from "@/hooks/useDebounce";
import MainSearch from "@/components/MainSearch";
import MultiSelect from "@/components/MultiSelect";
import SingleSelect from "@/components/SingleSelect";
import SortSelect, { SortOption } from "@/components/SortSelect";
import { useCategories } from "@/hooks/useCategories";
import { useCountries } from "@/hooks/useCountries";
import { useCities } from "@/hooks/useCities";
import { Button } from "@/components/ui/button";
import RelatedTicketCard from "./RelatedTicketCard";
import SkeletonCard from "./SkeletonCard";
import NotFoundComponent from "@/components/NotFoundComponent";
import Pagination from "@/components/Pagination";
import { RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  currentRelatedProducts: any[];
  currentTicketId?: string;
  onRelatedProductsChange: (updatedProducts: any[]) => void;
};

const AddRelated = ({ currentRelatedProducts, currentTicketId, onRelatedProductsChange }: Props) => {
  const { filters, setFilters, resetFilters } = useRelatedTicketFilters();
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);
  
  const SORT_OPTION: SortOption[] = [
    { label: "Alphabet", value: "alphabet" },
    { label: "Newest", value: "desc" },
    { label: "Oldest", value: "asc" },
  ];
  const debouncedSearch = useDebounce(filters.search, 500);

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
    data: productsData,
    isPending,
    isError,
    error,
  } = useQuery({
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
        page: page,
        pageSize: pageSize,
      },
    ],
    queryFn: async () => {
      const {
        categories,
        countryId,
        cityId,
        sort,
        published,
        search,
        isRecommended,
      } = {
        categories: filters.categories,
        countryId: filters.countryId,
        cityId: filters.cityId,
        sort: filters.sort,
        published: filters.published,
        search: debouncedSearch,
        isRecommended: filters.isRecommended,
      };

      const filter = {
        categoryIds: categories || [],
        category: "",
        cityId: cityId || "",
        countryId: countryId || "",
        limit: pageSize,
        page: page,
        published: published as "ALL" | "PUBLISHED" | "UNPUBLISHED",
        isRecommended: isRecommended,
        orderBy: {
          dir: sort?.toLowerCase() === "alphabet" ? "asc" : sort,
          field: sort?.toLowerCase() === "alphabet" ? "name" : "updatedAt",
        },
        name: search,
      };

      const res = await getAllProducts(filter);
      return {
        data: res?.data,
        total: res?.total,
        page: page,
        pageSize: pageSize,
      };
    },
    staleTime: 0,
    gcTime: 0,
  });

  const allProducts = useMemo(() => productsData?.data || [], [productsData]);

  // Show all products but disable already related and self ticket
  const allProductsWithStatus = useMemo(() => {
    // Create sets for fast lookup
    const alreadyRelatedProductIds = new Set(
      currentRelatedProducts.map((rp: any) => rp.productId || rp.id)
    );
    
    return allProducts.map((product: ProductT) => {
      const isSelfTicket = currentTicketId && product.id === currentTicketId;
      const isAlreadyRelated = alreadyRelatedProductIds.has(product.id);
      const isDisabled = isSelfTicket || isAlreadyRelated;
      
      let disabledReason = '';
      if (isSelfTicket) {
        disabledReason = 'Cannot relate ticket to itself';
      } else if (isAlreadyRelated) {
        disabledReason = 'Already related';
      }
      
      return {
        ...product,
        isDisabled,
        disabledReason,
        isSelfTicket,
        isAlreadyRelated
      };
    });
  }, [allProducts, currentRelatedProducts, currentTicketId]);

  // Check if a product is already related
  const isProductRelated = (productId: string) => {
    return currentRelatedProducts.some(item => (item.id || item.productId) === productId);
  };

  // Get related product data by productId
  const getRelatedProduct = (productId: string) => {
    return currentRelatedProducts.find(item => (item.id || item.productId) === productId);
  };

  // Toggle product in related products (add or remove)
  const toggleProductInRelated = (productId: string) => {
    if (isProductRelated(productId)) {
      // Remove product from related
      const updatedProducts = currentRelatedProducts.filter(
        item => (item.id || item.productId) !== productId
      );
      onRelatedProductsChange(updatedProducts);
    } else {
      // Add product to related
      const productToAdd = allProductsWithStatus.find((p: any) => p.id === productId);
      if (productToAdd) {
        const newRelatedProduct = {
          id: productId,
          image: productToAdd.image || "",
          isCancellable: productToAdd.isCancellable || false,
          isPublished: productToAdd.isPublished || true,
          name: productToAdd.name || "",
          originalPrice: productToAdd.originalPrice || 0,
          price: productToAdd.price || 0,
          requiresManualConfirmation: false,
          category: productToAdd.category || "",
          city: productToAdd.city || "",
          dhSellingPrice: productToAdd.dhSellingPrice || 0,
          productId: productId,
          linkBack: false,
        };
        const updatedProducts = [...currentRelatedProducts, newRelatedProduct];
        onRelatedProductsChange(updatedProducts);
      }
    }
  };

  // Update linkBack property for related product
  const updateRelatedProductLinkBack = (productId: string, linkBack: boolean) => {
    const updatedProducts = currentRelatedProducts.map(item =>
      (item.id || item.productId) === productId ? { ...item, linkBack } : item
    );
    onRelatedProductsChange(updatedProducts);
  };

  return (
    <div>
      <MainSearch
        search={filters.search}
        placeHolder="Search tickets..."
        onClick={(value: string) => {
          setFilters({ search: value });
        }}
      />

      <div className="flex justify-between gap-4 mt-3 mb-6 border px-4 py-2">
        <div className="flex gap-5 items-center">
          <MultiSelect
            label="Categories"
            placeholder="Categories"
            options={categoryData}
            value={filters.categories}
            onChange={(v) => setFilters({ categories: v })}
            width="w-32"
          />

          <SingleSelect
            label="Country"
            placeholder="Country"
            options={countryData?.data}
            value={filters.countryId}
            onChange={(v) => setFilters({ countryId: v })}
            width="w-32"
          />

          {filters.countryId && (
            <SingleSelect
              label="City"
              placeholder="City"
              options={cityData?.data || []}
              value={filters.cityId}
              onChange={(v) => setFilters({ cityId: v })}
              width="w-32"
            />
          )}
          
          <Select
            value={filters.published}
            onValueChange={(v) => setFilters({ published: v as any })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={
              filters.isRecommended ? "RECOMMENDED" : "NOT_RECOMMENDED"
            }
            onValueChange={(v) =>
              setFilters({
                isRecommended: v === "RECOMMENDED" ? true : false,
              })
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RECOMMENDED">Recommended</SelectItem>
              <SelectItem value="NOT_RECOMMENDED">
                (ALL)
              </SelectItem>
            </SelectContent>
          </Select>
          
          <SortSelect
            value={filters.sort}
            options={SORT_OPTION}
            onChange={(v) => setFilters({ sort: v as "alphabet" | "desc" | "asc" })}
          />
        </div>
        <button 
          type="button" 
          onClick={() => {
            resetFilters();
            setPage(1);
          }} 
          title="Reset filters"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {!isPending && allProductsWithStatus.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
          {allProductsWithStatus.map((product: any) => {
            const isRelated = isProductRelated(product.id);
            const relatedProduct = getRelatedProduct(product.id);
            const isSelfTicket = currentTicketId && product.id === currentTicketId;
            
            return (
              <div key={product.id} className="relative">
                <div className={isRelated ? "ring-2 ring-green-500 ring-offset-2 rounded-lg" : ""}>
                  <RelatedTicketCard
                    product={product}
                    isSelected={isRelated}
                    onToggle={() => toggleProductInRelated(product.id)}
                    showCheckbox={true}
                    linkBack={relatedProduct?.linkBack || false}
                    onLinkBackChange={(checked) => updateRelatedProductLinkBack(product.id, checked)}
                    isDisabled={isSelfTicket}
                  />
                </div>
                {isRelated && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-20 shadow-md">
                    Related
                  </div>
                )}
                {isSelfTicket && !isRelated && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-70 rounded-lg flex items-center justify-center z-20">
                    <div className="text-center p-2">
                      <p className="text-gray-500 text-sm font-medium">Cannot relate ticket to itself</p>
                      <p className="text-gray-400 text-xs mt-1">This product cannot be selected</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!isPending && allProductsWithStatus.length === 0 && (
        <NotFoundComponent message="No products found" />
      )}

      {/* Pagination */}
      {productsData?.total > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={productsData.total}
          onPageChange={(newPage) => {
            setPage(newPage);
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1); // Reset to first page when changing page size
          }}
        />
      )}
    </div>
  );
};

export default AddRelated;