const REVIEW_FIELDS = `
  id
  kind
  bookingRef
  reason
  status
  amount
  currency
  decidedBy
  decidedAt
  createdAt
  stripeDashboardUrl
`;

const STATUS_FIELDS = `
  level
  updatedBy
  updatedAt
  suggestedLevel
  warnings {
    failed24h
    failed7d
    fraudSignals7d
    byReason24h {
      reason
      count
    }
  }
`;

export const GET_BOOKING_SECURITY_STATUS = `
query BookingSecurityStatus {
  bookingSecurityStatus {${STATUS_FIELDS}}
}
`;

export const SET_BOOKING_SECURITY_LEVEL = `
mutation SetBookingSecurityLevel($level: BookingSecurityLevel!) {
  setBookingSecurityLevel(level: $level) {${STATUS_FIELDS}}
}
`;

export const GET_PAYMENT_REVIEWS = `
query PaymentReviews($status: PaymentReviewStatus) {
  paymentReviews(status: $status) {${REVIEW_FIELDS}}
}
`;

export const APPROVE_PAYMENT_REVIEW = `
mutation ApprovePaymentReview($id: ID!) {
  approvePaymentReview(id: $id) {${REVIEW_FIELDS}}
}
`;

export const REJECT_PAYMENT_REVIEW = `
mutation RejectPaymentReview($id: ID!) {
  rejectPaymentReview(id: $id) {${REVIEW_FIELDS}}
}
`;
