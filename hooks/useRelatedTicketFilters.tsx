import { useState, useCallback } from "react";

export interface RelatedTicketFilterState {
  search: string;
  categories: string[];
  countryId: string;
  cityId: string;
  published: "ALL" | "PUBLISHED" | "UNPUBLISHED";
  isRecommended: boolean | null;
  sort: "alphabet" | "desc" | "asc";
}

const useRelatedTicketFilters = () => {
  const [filters, setFilters] = useState<RelatedTicketFilterState>({
    search: "",
    categories: [],
    countryId: "",
    cityId: "",
    published: "PUBLISHED",
    isRecommended: null,
    sort: "desc",
  });

  const updateFilters = useCallback(
    (newFilters: Partial<RelatedTicketFilterState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      categories: [],
      countryId: "",
      cityId: "",
      published: "PUBLISHED",
      isRecommended: null,
      sort: "desc",
    });
  }, []);

  return {
    filters,
    setFilters: updateFilters,
    resetFilters,
  };
};

export default useRelatedTicketFilters;