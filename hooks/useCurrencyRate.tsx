import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrencyRate } from "@/graphql/currencyRate";
import { CurrencyRateT } from "@/types/currencyRate.type";

export const useCurrencyRate = (autoRefresh: boolean = true) => {
  const queryClient = useQueryClient();

  // Fetch currency rate
  const queryResult = useQuery({
    queryKey: ["currency-rate"],
    queryFn: async () => {
      const response: any = await getCurrencyRate();
      return response.data.currencyRate as CurrencyRateT;
    },
    staleTime: 60000, // Consider data stale after 1 minute
    gcTime: 300000, // Garbage collect after 5 minutes,
    refetchOnWindowFocus:true
  });

  // Set up auto-refresh interval if enabled
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefresh) {
      // Refresh immediately
      queryResult.refetch();
      
      // Set up interval to refetch every minute
      intervalId = setInterval(() => {
        queryResult.refetch();
      }, 60000); // 1 minute
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, queryResult]);

  // Function to manually refetch
  const refetchCurrencyRate = () => {
    return queryClient.invalidateQueries({ queryKey: ["currency-rate"] });
  };

  return {
    ...queryResult,
    refetchCurrencyRate,
  };
};