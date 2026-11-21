import { warpGql } from "@/util";
import client from "./client";
import {
  BOOKING_CREATE_MUTATION,
  BOOKING_CREATE_MUTATION_DATA_TYPE,
  CONFIRM_BOOKING_MUTATION,
  GET_BOOKING_DETAIL,
  GET_MY_BOOKING_QUERY,
  GET_MY_BOOKING_QUERY_DATA_TYPE,
  MY_BOOKINGS_QUERY,
  REFRESH_BOOKING_MUTATION,
  SEND_BOOKING_FAILED_APOLOGY_MUTATION,
  UPLOAD_BOOKING_VOUCHER_MUTATION,
} from "./type-query/booking";
import { getSignedUrl } from "./file";
import { RESEND_EMAIL_MUTATION } from "./type-query/product";
import {
  BookingSummaryFindInputT,
  BookingSummaryPagedOutputT,
  FilterBookingListT,
  FindAllTransactionsT,
} from "@/types/booking.type";

export const createBookingWithCart = async (
  data: BOOKING_CREATE_MUTATION_DATA_TYPE,
) => {
  return client
    .mutate({
      mutation: warpGql(BOOKING_CREATE_MUTATION),
      variables: {
        data: data,
      },
    })
    .then((res) => res)
    .catch((err) => {
      throw err;
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

export const sendBookingFailedApologyEmail = (transactionId: string) => {
  return client.mutate({
    mutation: warpGql(SEND_BOOKING_FAILED_APOLOGY_MUTATION),
    variables: { transactionId },
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

// Unified ticket + hotel booking list (myBookings query)
export const getMyBookings = async (
  params: BookingSummaryFindInputT,
): Promise<BookingSummaryPagedOutputT> => {
  const res: any = await client.query({
    query: warpGql(MY_BOOKINGS_QUERY),
    variables: { params },
    fetchPolicy: "no-cache",
  });
  return res.data.myBookings;
};

export const fetchMyBookings = async ({ pageParam = 1, queryKey }: any) => {
  const [, { bucket, status, kind, sort, search, purchasedFrom, purchasedTo }] = queryKey;
  const limit = 10;
  const res = await getMyBookings({
    page: pageParam,
    limit,
    orderBy: { dir: sort },
    bucket: bucket || undefined,
    status: status === "ALL" ? undefined : status,
    kind: kind === "ALL" ? undefined : kind,
    search: search || undefined,
    purchasedFrom: purchasedFrom || undefined,
    purchasedTo: purchasedTo || undefined,
  });
  return {
    data: res.data,
    total: res.total,
    nextPage: pageParam * limit < res.total ? pageParam + 1 : null,
  };
};

export const fetchMyBookingList = async ({ pageParam = 1, queryKey }: any) => {
  const [_key, { status, sort, search, requireManualConfirm = null }] =
    queryKey;
  const filter: FilterBookingListT = {
    page: pageParam,
    limit: 10,
    orderBy: { dir: sort, field: "transactedTime" },
    status: status,
    search: search ?? null,
    requireManualConfirm: requireManualConfirm,
  };
  const res = await getMyBookingList(filter);
  return {
    data: res?.data,
    nextPage: res?.data?.length ? pageParam + 1 : null,
  };
};

export const confirmBooking = async (id: string) => {
  return client.mutate({
    mutation: warpGql(CONFIRM_BOOKING_MUTATION),
    variables: {
      data: {
        transactionId: id,
      },
    },
  });
};

export const refreshBooking = async (id: string) => {
  return client.mutate({
    mutation: warpGql(REFRESH_BOOKING_MUTATION),
    variables: { data: { transactionId: id } },
  });
};

// Presigned POST to S3 (key = fields.key), then attach the key to the booking.
export const uploadBookingVoucher = async (id: string, file: File) => {
  const signed: any = await getSignedUrl({
    filename: "voucher.pdf",
    folder: "TICKET_VOUCHER",
  });
  const { url, fields } = signed.data.getPresignedPost;
  const formData = new FormData();
  Object.entries(fields).forEach(([k, v]) => formData.append(k, v as string));
  formData.append("file", file);
  const response = await fetch(url, { method: "POST", body: formData });
  if (!response.ok) throw new Error("Voucher upload to storage failed");
  return client.mutate({
    mutation: warpGql(UPLOAD_BOOKING_VOUCHER_MUTATION),
    variables: { data: { transactionId: id, key: fields.key } },
  });
};
