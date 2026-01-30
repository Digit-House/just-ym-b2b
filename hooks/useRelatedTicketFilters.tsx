import { useState, useCallback, useEffect } from "react";

export interface RelatedTicketFilterState {
  search: string;
  categories: string[];
  countryId: string;
  cityId: string;
  published: "ALL" | "PUBLISHED" | "UNPUBLISHED";
  isRecommended: boolean | null;
  sort: "alphabet" | "desc" | "asc";
}

const STORAGE_KEY = "relatedTicketFilters";

const getDefaultFilters = (): RelatedTicketFilterState => ({
  search: "",
  categories: [],
  countryId: "",
  cityId: "",
  published: "PUBLISHED",
  isRecommended: null,
  sort: "desc",
});

const loadFiltersFromStorage = (): RelatedTicketFilterState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate and merge with defaults to ensure all fields exist
      return { ...getDefaultFilters(), ...parsed };
    }
  } catch (error) {
    console.warn("Failed to load filters from localStorage:", error);
  }
  return getDefaultFilters();
};

const saveFiltersToStorage = (filters: RelatedTicketFilterState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.warn("Failed to save filters to localStorage:", error);
  }
};

const useRelatedTicketFilters = () => {
  const [filters, setFilters] = useState<RelatedTicketFilterState>(loadFiltersFromStorage());

  const updateFilters = useCallback(
    (newFilters: Partial<RelatedTicketFilterState>) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters };
        saveFiltersToStorage(updated);
        return updated;
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    const defaultFilters = getDefaultFilters();
    setFilters(defaultFilters);
    saveFiltersToStorage(defaultFilters);
  }, []);

  // Clear localStorage entirely (hard reset)
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear filters from localStorage:", error);
    }
  }, []);

  return {
    filters,
    setFilters: updateFilters,
    resetFilters,
    clearStorage,
  };
};

export default useRelatedTicketFilters;