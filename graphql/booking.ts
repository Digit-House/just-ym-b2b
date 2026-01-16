import { warpGql } from "@/util";
import client from "./client";
import {
  BOOKING_CREATE_MUTATION,
  BOOKING_CREATE_MUTATION_DATA_TYPE,
  GET_BOOKING_DETAIL,
  GET_MY_BOOKING_QUERY,
  GET_MY_BOOKING_QUERY_DATA_TYPE,
} from "./type-query/booking";
import { RESEND_EMAIL_MUTATION } from "./type-query/product";
import { FilterBookingListT } from "@/types/product.type";
import { FindAllTransactionsT } from "@/types/booking.type";

export const createBookingWithCart = async (
  data: BOOKING_CREATE_MUTATION_DATA_TYPE
) => {
  return client.mutate({
    mutation: warpGql(BOOKING_CREATE_MUTATION),
    variables: {
      data: data,
    },
  });
};

export const getBookingDetail = (id: string) => {
  return client.query({
    query: warpGql(GET_BOOKING_DETAIL),
    variables: {
      data: {
        transactionId: id,
        // transactionRefNumber: refNumber,
      },
    },
    fetchPolicy: "no-cache",
  });
};

export const resendEmail = (email: string, id: string) => {
  return client.mutate({
    mutation: warpGql(RESEND_EMAIL_MUTATION),
    variables: {
      data: {
        email: email,
        transactionId: id,
      },
    },
  });
};

export const getMyBookingList = async (data: FilterBookingListT) => {
  try {
    const res = await client.query({
      query: warpGql(GET_MY_BOOKING_QUERY),
      variables: {
        params: data,
      },
      fetchPolicy: "no-cache",
    });
    //@ts-ignore
    return res.data.findAllTransactions as FindAllTransactionsT;
  } catch (err) {
    throw err;
  }
};

export const fetchMyBookingList = async ({ pageParam = 1, queryKey }: any) => {
  const [_key, { status, sort }] = queryKey;
  const filter = {
    page: pageParam,
    limit: 10,
    orderBy: { dir: sort },
    status: status,
  };
  const res = await getMyBookingList(filter);
  return {
    data: res?.data,
    nextPage: res?.data?.length ? pageParam + 1 : null,
  };
};
