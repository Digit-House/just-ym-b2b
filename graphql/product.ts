import { warpGql } from "@/util";
import client from "./client";
import { GET_ALL_PRODUCTS } from "./type-query/product";

export const getAllProducts = async () => {
  return client.query({
    query: warpGql(GET_ALL_PRODUCTS),
    variables: {
      params: {
        limit: 1,
        orderBy: {
          dir: "asc",
        },
        page: 10,
      },
    },
  });
};
