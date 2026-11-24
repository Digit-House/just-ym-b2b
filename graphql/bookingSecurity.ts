import { warpGql } from "@/util";
import client from "./client";
import {
  APPROVE_PAYMENT_REVIEW,
  GET_BOOKING_SECURITY_STATUS,
  GET_PAYMENT_REVIEWS,
  REJECT_PAYMENT_REVIEW,
  SET_BOOKING_SECURITY_LEVEL,
} from "./type-query/bookingSecurity";

export type BookingSecurityLevelT = "NORMAL" | "HIGH" | "LOCKDOWN" | "PAUSED";
export type PaymentReviewStatusT = "PENDING" | "APPROVED" | "REJECTED";
export type PaymentReviewReasonT =
  | "NO_3DS"
  | "RISK_ELEVATED"
  | "RISK_HIGHEST"
  | "LOCKDOWN";

export type BookingSecurityStatusT = {
  level: BookingSecurityLevelT;
  updatedBy: string | null;
  updatedAt: string | null;
  suggestedLevel: BookingSecurityLevelT;
  warnings: {
    failed24h: number;
    failed7d: number;
    fraudSignals7d: number;
    byReason24h: { reason: string; count: number }[];
  };
};

export type PaymentReviewT = {
  id: string;
  kind: "CART" | "HOTEL";
  bookingRef: string;
  reason: PaymentReviewReasonT;
  status: PaymentReviewStatusT;
  amount: number | null;
  currency: string | null;
  decidedBy: string | null;
  decidedAt: string | null;
  createdAt: string;
  stripeDashboardUrl: string | null;
};

export const getBookingSecurityStatus = async () => {
  const res: any = await client.query({
    query: warpGql(GET_BOOKING_SECURITY_STATUS),
    fetchPolicy: "no-cache",
  });
  return res.data.bookingSecurityStatus as BookingSecurityStatusT;
};

export const setBookingSecurityLevel = async (level: BookingSecurityLevelT) => {
  const res: any = await client.mutate({
    mutation: warpGql(SET_BOOKING_SECURITY_LEVEL),
    variables: { level },
    fetchPolicy: "no-cache",
  });
  return res.data.setBookingSecurityLevel as BookingSecurityStatusT;
};

export const getPaymentReviews = async (status: PaymentReviewStatusT) => {
  const res: any = await client.query({
    query: warpGql(GET_PAYMENT_REVIEWS),
    variables: { status },
    fetchPolicy: "no-cache",
  });
  return res.data.paymentReviews as PaymentReviewT[];
};

export const approvePaymentReview = async (id: string) => {
  const res: any = await client.mutate({
    mutation: warpGql(APPROVE_PAYMENT_REVIEW),
    variables: { id },
    fetchPolicy: "no-cache",
  });
  return res.data.approvePaymentReview as PaymentReviewT;
};

export const rejectPaymentReview = async (id: string) => {
  const res: any = await client.mutate({
    mutation: warpGql(REJECT_PAYMENT_REVIEW),
    variables: { id },
    fetchPolicy: "no-cache",
  });
  return res.data.rejectPaymentReview as PaymentReviewT;
};

// Apollo 4 surfaces the GraphQL error code in extensions; fall back to the message.
export const errorCode = (err: unknown): string => {
  const e: any = err;
  const code = e?.errors?.[0]?.extensions?.code ?? e?.graphQLErrors?.[0]?.extensions?.code;
  return code ?? (err instanceof Error ? err.message : "");
};
