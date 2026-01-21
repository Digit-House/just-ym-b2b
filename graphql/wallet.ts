import { warpGql } from "@/util";
import client from "./client";
import {
  ADD_TOP_UP,
  ADMIN_TOPUP,
  CONFIRM_TOPUP,
  GET_CREDIT_INFO,
  TOP_UP_HISTORY,
  TOPUP_HISTORY,
} from "./type-query/wallet";
import { AddTopupPayloadT, AdminTopupPayloadT, TopUpHistoryFilterT } from "@/types/wallet.type";

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
    fetchPolicy: "no-cache",
  });
};

export const getAdminTopupHistory = async (payload: TopUpHistoryFilterT) => {
  return client.query({
    query: warpGql(TOPUP_HISTORY),
    variables: {
      data: { ...payload },
    },
    fetchPolicy: "no-cache",
  });
};

export const adminTopup = async (payload: AdminTopupPayloadT) => {
  return client.mutate({
    mutation: warpGql(ADMIN_TOPUP),
    variables: {
      data: { ...payload },
    },
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

export const confirmTopup = async (
  creditTopUpId: string,
  topUpBalance: number,
  status: string
) => {
  return client.mutate({
    mutation: warpGql(CONFIRM_TOPUP),
    variables: {
      data: {
        creditTopUpId: creditTopUpId,
        topUpBalance: topUpBalance,
        status: status
      },
    },
  });
};
