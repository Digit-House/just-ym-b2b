import { useQuery } from "@tanstack/react-query";
import { warpGql } from "@/util";
import client from "@/graphql/client";
import { GET_ALL_COUNTRIES } from "@/graphql/type-query/queries";

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      try{
        const { data }: any = await client.query({
          query: warpGql(GET_ALL_COUNTRIES),
          fetchPolicy: "cache-first",
        });
  
        return data?.countries || [];
      }catch(err){
        console.log("Error fetching countries:", err);
        return []
      }
    },
    staleTime: Infinity, 
    gcTime: Infinity, 
  });
};
