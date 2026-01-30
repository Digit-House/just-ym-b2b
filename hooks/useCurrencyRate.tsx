import { useQuery } from "@tanstack/react-query";
import { getCurrencyRate } from "@/graphql/currencyRate";
import { CurrencyRateT } from "@/types/currencyRate.type";

export const useCurrencyRate = (autoRefresh: boolean = true) => {
  return useQuery<CurrencyRateT>({
    queryKey: ["currency-rate"],

    queryFn: async () => {
      const response: any = await getCurrencyRate();
      return response.data.currencyRate as CurrencyRateT;
    },

    // staleTime: 60_000,        // data fresh for 1 min
    staleTime: 15_000,
    gcTime: 300_000,          // cache for 5 min

    refetchInterval: autoRefresh ? 60_000 : false,
    refetchIntervalInBackground: true,

    refetchOnWindowFocus: true,
    retry: 1,
  });
};
