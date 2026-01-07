import { useQuery } from "@tanstack/react-query";
import { warpGql } from "@/util";
import client from "@/graphql/client";
import { GET_ALL_CITIES } from "@/graphql/type-query/queries";
import { CityFilterT, CityT } from "@/types/cities.type";

type CitiesResponseT = {
  data: CityT[];
  total: number;
};

export const useCities = ({
  countryId,
  limit,
  page,
  orderBy,
  isPublished,
  search,
}: CityFilterT) => {
  return useQuery<CitiesResponseT>({
    queryKey: ["cities", countryId, limit, page, orderBy, isPublished, search],
    enabled: !!countryId,
    queryFn: async () => {
      try {
        const { data }: any = await client.query({
          query: warpGql(GET_ALL_CITIES),
          variables: {
            params: {
              countryId: countryId,
              limit,
              page,
              orderBy,
              isPublished,
              search,
            },
          },
          fetchPolicy: "no-cache",
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
