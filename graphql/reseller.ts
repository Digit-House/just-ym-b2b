import { warpGql } from "@/util";
import client from "./client";
import { FilterT } from "@/types/index.type";
import { CREATE_RESELLER, GET_ALL_RESELLERS } from "./type-query/reseller";
import { CreateResellerPayloadT } from "@/types/reseller.type";

export const getResellers = async (payload: FilterT) => {
  return client.query({
    query: warpGql(GET_ALL_RESELLERS),
    variables: {
      params: { ...payload },
    },
    fetchPolicy: "no-cache",
  });
};

export const createReseller = async (payload: CreateResellerPayloadT) => {
  return client.mutate({
    mutation: warpGql(CREATE_RESELLER),
    variables: {
      data: {
        name: payload.name,
        credit: {
          ...payload.credit,
        },
      },
    },
    fetchPolicy: "no-cache",
  });
};
