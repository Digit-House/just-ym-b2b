import { warpGql } from "@/util";
import client from "./client";
import {
  CREATE_RESELLER,
  GET_ALL_RESELLERS,
  UPDATE_RESELLER,
} from "./type-query/reseller";
import { CreateResellerPayloadT, ResellerFilterT } from "@/types/reseller.type";

export const getResellers = async (payload: ResellerFilterT) => {
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
        user: {
          ...payload.user,
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

export const updateReseller = async (
  payload: UpdateResellerPayloadT
) => {
  return client.mutate({
    mutation: warpGql(UPDATE_RESELLER),
    variables: {
      data: {
        id:payload.id,
        name: payload.name,
        active: payload.active,
      },
    },
    fetchPolicy: "no-cache",
  });
};

// id: string;
// name?: string;
// active?: boolean;
// credit?: {
//   balance?: number;
//   currency?: string;
//   relatedImages?: string[] | null;
// };
