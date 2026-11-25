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
  MY_BOOKINGS_OWNER_QUERY,
  SEND_CARD_VERIFICATION_MUTATION,
  REFRESH_BOOKING_MUTATION,
  SEND_BOOKING_FAILED_APOLOGY_MUTATION,
  UPLOAD_BOOKING_VOUCHER_MUTATION,
  BOOKING_TICKET_VIEW_URL_QUERY,
} from "./type-query/booking";
import { getSignedUrl } from "./file";
import { RESEND_EMAIL_MUTATION } from "./type-query/product";
import {
  BOOKING_STATUS_ENUM,
  BookingSummaryT,
  MY_BOOKING_DATA_TYPE,
  BookingSummaryFindInputT,
  CardVerificationSendResultT,
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

export const sendBookingFailedApologyEmail = (
  transactionId: string,
  voucherCode?: string
) => {
  return client.mutate({
    mutation: warpGql(SEND_BOOKING_FAILED_APOLOGY_MUTATION),
    variables: { transactionId, voucherCode },
  });
};

export const sendCardVerification = async (
  transactionIds: string[],
  testEmail?: string,
): Promise<CardVerificationSendResultT[]> => {
  const res: any = await client.mutate({
    mutation: warpGql(SEND_CARD_VERIFICATION_MUTATION),
    variables: { input: { transactionIds, testEmail: testEmail || undefined } },
  });
  return res.data.sendCardVerification;
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
  owner = false,
): Promise<BookingSummaryPagedOutputT> => {
  const res: any = await client.query({
    query: warpGql(owner ? MY_BOOKINGS_OWNER_QUERY : MY_BOOKINGS_QUERY),
    variables: { params },
    fetchPolicy: "no-cache",
  });
  return res.data.myBookings;
};

// The summary list has no manual-confirm filter, so that view reads findAllTransactions and maps rows to the card shape.
const transactionToSummary = (t: MY_BOOKING_DATA_TYPE): BookingSummaryT => {
  const tickets = t.bookingTickets ?? [];
  const visit = tickets.find((x) => x.visitDate)?.visitDate;
  return {
    id: t.id,
    kind: "TICKET",
    bucket: "UPCOMING",
    title: tickets[0]?.productName ?? t.transactionRefNumber,
    thumbnail: tickets[0]?.image ?? null,
    amount: String(t.transactedAmount),
    currencyCode: "THB",
    quantity: tickets.reduce((n, x) => n + (x.quantity ?? 0), 0),
    customerName: t.customerName,
    customerEmail: t.email,
    paymentStatus: t.status,
    fulfillmentStatus: t.isTicketConfirmed ? "CONFIRMED" : "PENDING",
    purchasedAt: new Date(t.transactedTime).toISOString(),
    relevantDate: new Date(visit ?? t.transactedTime).toISOString(),
    referenceNumber: t.transactionRefNumber,
    voucherDiscountAmount: 0,
    ticketDetail: {
      eTicketUrl: t.eTicketUrl,
      viewTicketUrl: t.viewTicketUrl,
      isTicketReady: t.isTicketReady,
      isManualHeld: t.isManualHeld ?? false,
      requiresManualConfirm: t.requiresManualConfirm,
    },
  };
};

export const fetchMyBookings = async ({ pageParam = 1, queryKey }: any) => {
  const [
    ,
    { bucket, status, kind, sort, search, purchasedFrom, purchasedTo, cardCheck, owner, requireManualConfirm },
  ] = queryKey;
  const limit = 10;
  if (owner && requireManualConfirm) {
    const res = await getMyBookingList({
      page: pageParam,
      limit,
      orderBy: { dir: sort, field: "transactedTime" },
      status: BOOKING_STATUS_ENUM.PAID,
      search: search || null,
      requireManualConfirm: true,
    });
    return {
      data: kind === "HOTEL" ? [] : (res?.data ?? []).map(transactionToSummary),
      total: res?.total ?? 0,
      nextPage: pageParam * limit < (res?.total ?? 0) ? pageParam + 1 : null,
    };
  }
  const res = await getMyBookings(
    {
    page: pageParam,
    limit,
    orderBy: { dir: sort },
    bucket: bucket || undefined,
    status: status === "ALL" ? undefined : status,
    kind: kind === "ALL" ? undefined : kind,
    search: search || undefined,
    purchasedFrom: purchasedFrom || undefined,
    purchasedTo: purchasedTo || undefined,
    cardVerificationStatus: owner ? cardCheck || undefined : undefined,
    },
    !!owner,
  );
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

// Owner only: a short-lived signed URL (CORS, inline PDF) for the saved ticket.
export const getBookingTicketViewUrl = async (id: string): Promise<string> => {
  const res = await client.query<{ bookingTicketViewUrl: string }>({
    query: warpGql(BOOKING_TICKET_VIEW_URL_QUERY),
    variables: { transactionId: id },
    fetchPolicy: "no-cache",
  });
  return res.data.bookingTicketViewUrl;
};

export const refreshBooking = async (id: string) => {
  return client.mutate({
    mutation: warpGql(REFRESH_BOOKING_MUTATION),
    variables: { data: { transactionId: id } },
  });
};

// Presigned POST to S3 (key = fields.key), then attach the key to the booking.
export const uploadBookingVoucher = async (id: string, file: File, currentUrl?: string) => {
  const signed: any = await getSignedUrl({
    filename: "voucher.pdf",
    folder: "TICKET_VOUCHER",
    updateUrl: currentUrl || undefined, // reuse the saved ticket's S3 key
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
