import { useQuery } from "@tanstack/react-query";
import { warpGql } from "@/util";
import client from "@/graphql/client";
import { GET_ALL_CITIES } from "@/graphql/type-query/queries";

export const useCities = (id: string) => {
  return useQuery({
    queryKey: ["cities", id],
    queryFn: async () => {
      try {
        const { data }: any = await client.query({
          query: warpGql(GET_ALL_CITIES),
          variables: { countryId: id },
          fetchPolicy: "cache-first",
        });

        return data?.cities || [];
      } catch (err) {
        console.log("Error fetching cities:", err);
        return [];
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
