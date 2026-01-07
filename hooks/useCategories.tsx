import { useQuery } from "@tanstack/react-query";
import { warpGql } from "@/util";
import client from "@/graphql/client";
import { GET_ALL_CATEGORIES } from "@/graphql/type-query/queries";

type UseCategoriesParams = {
  limit?: number;
  page?: number;
  orderBy?: {
    dir: "asc" | "desc";
  };
};

export const useCategories = ({
  limit = 10,
  page = 1,
  orderBy = { dir: "desc" },
}: UseCategoriesParams = {}) => {
  return useQuery({
    queryKey: ["categories", limit, page, orderBy.dir],
    queryFn: async () => {
      const { data }: any = await client.query({
        query: warpGql(GET_ALL_CATEGORIES),
        variables: {
          params: {
            limit,
            page,
            orderBy,
          },
        },
        fetchPolicy: "no-cache",
      });

      return data?.findAllCategories?.data;
    },
  });
};
