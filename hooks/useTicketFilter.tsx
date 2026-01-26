import { useEffect, useState } from "react";


export type PublishedFilter = "ALL" | "PUBLISHED" | "UNPUBLISHED";

interface TicketFilters {
  sort: string;
  published: PublishedFilter;
  categories: string[];
  countries: string[];
  isRecommended:null|boolean;
  search: string;
}

const STORAGE_KEY = "ticketFilters";

const DEFAULT_FILTERS: TicketFilters = {
  sort: "alphabet",
  published: "PUBLISHED",
  categories: [],
  countries: [],
  isRecommended:null,
  search: "",
};

export function useTicketFilters() {
  const [filters, setFilters] = useState<TicketFilters>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_FILTERS, ...JSON.parse(stored) } : DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    filters,
    setFilters,
    resetFilters,
  };
}
