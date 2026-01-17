import { warpGql } from "@/util";
import client from "./client";
import {
  GET_CURRENCY_RATE,
  UPDATE_CURRENCY_RATE,
} from "./type-query/currencyRate";

export const getCurrencyRate = async () => {
  return client.query({
    query: warpGql(GET_CURRENCY_RATE),
    fetchPolicy:"no-cache"
  });
};

export const updateCurrencyRate = async (mmk: number) => {
  return client.mutate({
    mutation: warpGql(UPDATE_CURRENCY_RATE),
    variables: {
      input: {
        mmk: mmk,
      },
    },
    fetchPolicy:"no-cache"
  });
};
