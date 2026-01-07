import { warpGql } from "@/util";
import client from "./client";
import { FilterT } from "@/types/index.type";
import { GET_ALL_RESELLERS } from "./type-query/reseller";

export const getResellers = async (payload: FilterT) => {
  return client.query({
    query: warpGql(GET_ALL_RESELLERS),
    variables: {
      params: { ...payload },
      fetchPolicy: "no-cache",
    },
  });
};
