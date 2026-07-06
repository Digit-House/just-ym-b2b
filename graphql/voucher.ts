import { warpGql } from "@/util";
import client from "./client";
import {
  GET_VOUCHER_DETAIL_QUERY,
  GET_VOUCHER_LIST,
  GET_VOUCHER_LIST_DATA_TYPE,
  SUBMIT_VOUCHER_MUTATION,
  UPDATE_VOUCHER_MUTATION,
  VoucherCreateInputDTO,
  VoucherUpdateInputDTO,
} from "./type-query/voucher";
import {
  VOUCHER_STATUS_ENUM,
  VoucherDetailResponse,
  VoucherListInfoT,
} from "@/types/voucher.type";

export const getVoucherList = async (data: GET_VOUCHER_LIST_DATA_TYPE) => {
  try {
    const res = await client.query<VoucherListInfoT["data"]>({
      query: warpGql(GET_VOUCHER_LIST),
      variables: {
        params: data,
      },
      fetchPolicy: "no-cache",
    });
    if (!res.data) {
      throw new Error("No voucher list data returned");
    }
    return res.data.findAllVouchers;
  } catch (err) {
    throw err;
  }
};

export const fetchVoucherList = async ({ pageParam = 1, queryKey }: any) => {
  const [_key, { status, sort }] = queryKey;

  const filter: GET_VOUCHER_LIST_DATA_TYPE = {
    limit: 10,
    page: pageParam,
    orderBy: { dir: sort },
    status: status,
  };

  const res = await getVoucherList(filter);
  return {
    data: res?.data,
    nextPage: res?.data?.length ? pageParam + 1 : null,
  };
};

export const submitVoucher = async (data: VoucherCreateInputDTO) => {
  try {
    const res = await client.mutate({
      mutation: warpGql(SUBMIT_VOUCHER_MUTATION),
      variables: {
        data: data,
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const getVoucherDetail = async (id: string) => {
  try {
    const res = await client.query<VoucherDetailResponse["data"]>({
      query: warpGql(GET_VOUCHER_DETAIL_QUERY),
      variables: {
        findOneVoucherId: id,
      },
      fetchPolicy: "no-cache",
    });
    if (!res.data) {
      throw new Error("No voucher detail data returned");
    }
    return res.data.findOneVoucher;
  } catch (err) {
    throw err;
  }
};

export const updateVoucher = async (data: VoucherUpdateInputDTO) => {
  try {
    const res = await client.mutate({
      mutation: warpGql(UPDATE_VOUCHER_MUTATION),
      variables: {
        data: data,
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
};
