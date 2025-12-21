import { warpGql } from "@/util";
import client from "./client";
import { GET_ALL_CATEGORIES, GET_ALL_COUNTRIES } from "./type-query/queries";

export const getCategories = () => {
  return client.query({
    query: warpGql(GET_ALL_CATEGORIES),
    variables: {
      parmas: {
        limit: 10,
        orderBy: {
          dir: "desc",
        },
        page: 1,
      },
    },
  });
};

export const getCountries = () => {
  return client.query({
    query:warpGql(GET_ALL_COUNTRIES), 
  })
}