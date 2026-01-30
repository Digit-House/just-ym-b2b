import { warpGql } from "@/util";
import client from "./client";
import { CREDIT_LOGS } from "./type-query/transaction";
import { TransactionFilterT } from "@/types/transaction.type";

export const getAllCreditLogs = async (payload: TransactionFilterT) => {
  return client.query({
    query: warpGql(CREDIT_LOGS),
    variables: {
      params: { ...payload },
    },
    fetchPolicy: "no-cache",
  });
};
