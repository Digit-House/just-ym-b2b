import { warpGql } from "@/util";
import client from "./client";
import { FilterT } from "@/types/index.type";
import { CREATE_RESELLER, GET_ALL_RESELLERS, UPDATE_RESELLER } from "./type-query/reseller";
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

export type UpdateResellerPayloadT = {
  id: string;
  name?: string;
  active?: boolean;
  credit?: {
    balance?: number;
    currency?: string;
    relatedImages?: string[] | null;
  };
};

export const updateReseller = async (id: string, payload: UpdateResellerPayloadT) => {
  return client.mutate({
    mutation: warpGql(UPDATE_RESELLER),
    variables: {
      id,
      data: {
        name: payload.name,
        active: payload.active,
        credit: payload.credit ? {
          ...payload.credit,
        } : undefined,
      },
    },
    fetchPolicy: "no-cache",
  });
};
