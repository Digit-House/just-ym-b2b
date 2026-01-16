import { warpGql } from "@/util";
import client from "./client";
import { GENERATE_REPORTS } from "./type-query/report";
import { FilterReportT } from "@/types/report.type";

export const generateReport = (payload: FilterReportT) => {
  return client.query({
    query: warpGql(GENERATE_REPORTS),
    variables: {
      data: {
        fromDate: payload.fromDate,
        selfSale: payload.selfSale,
        sellerId: payload.sellerId,
        toDate: payload.toDate,
      },
    },
  });
};
