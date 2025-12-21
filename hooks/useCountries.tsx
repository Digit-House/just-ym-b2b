import { useQuery } from "@tanstack/react-query";
import { warpGql } from "@/util";
import client from "@/graphql/client";
import { GET_ALL_COUNTRIES } from "@/graphql/type-query/queries";

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data }:any = await client.query({
        query: warpGql(GET_ALL_COUNTRIES),
      });
      return data?.countries;
    },
  });
};
