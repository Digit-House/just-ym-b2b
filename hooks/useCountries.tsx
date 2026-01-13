import { useQuery } from "@tanstack/react-query";
import { warpGql } from "@/util";
import client from "@/graphql/client";
import { GET_ALL_COUNTRIES } from "@/graphql/type-query/queries";
import { CountryFilterT, CountryT } from "@/types/country.type";

type CountriesResponseT = {
  data: CountryT[];
  total: number;
};

export const useCountries = ({
  limit,
  page,
  orderBy,
  isPublished,
  search,
}: CountryFilterT) => {
  return useQuery<CountriesResponseT>({
    queryKey: ["countries", limit, page, orderBy.dir, isPublished, search],
    queryFn: async () => {
      try {
        const { data }: any = await client.query({
          query: warpGql(GET_ALL_COUNTRIES),
          variables: {
            params: {
              limit,
              page,
              orderBy,
              isPublished,
              search,
            },
          },
          //fetchPolicy: "no-cache",
        });
        return data?.countries || [];
      } catch (err) {
        console.log("Error fetching countries:", err);
        return [];
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
