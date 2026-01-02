import { warpGql } from "@/util";
import client from "./client";
import {
  ADD_TOP_UP,
  GET_CREDIT_INFO,
  TOP_UP_HISTORY,
} from "./type-query/wallet";
import { AddTopupPayloadT, TopUpHistoryFilterT } from "@/types/wallet.type";

export const getCredictInfo = async () => {
  return client.query({
    query: warpGql(GET_CREDIT_INFO),
    fetchPolicy: "no-cache",
  });
};

export const getTopupHistory = async (payload: TopUpHistoryFilterT) => {
  return client.query({
    query: warpGql(TOP_UP_HISTORY),
    variables: {
      data: { ...payload },
    },
    fetchPolicy:"no-cache"
  });
};

export const addTopup = async (payload: AddTopupPayloadT) => {
  return client.mutate({
    mutation: warpGql(ADD_TOP_UP),
    variables: {
      data: { ...payload },
    },
  });
};
