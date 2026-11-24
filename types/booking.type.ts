export enum BOOKING_STATUS_ENUM {
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
  PAID = "PAID",
  PENDING = "PENDING",
}

export type FilterBookingListT = {
  limit: number;
  orderBy: {
    dir: "asc" | "desc";
    field: string;
  };
  page: number;
  search: string | null;
  status: BOOKING_STATUS_ENUM;
  reset?: boolean; // Flag to indicate filter reset
  requireManualConfirm: boolean | null; // Flag to indicate require manual confirm
};

export type PAYMENT_DETAIL_TYPE = {
  brand: string;
  last4: string;
  method: string;
  stripeCSId: string;
  stripeClientSecret: string;
  amount: string;
};

export type VISIT_DATE_TYPE = {
  productId: string;
  value: Date;
};

export interface FindAllTransactionsT {
  total: number;
  data: MY_BOOKING_DATA_TYPE[];
}

export type MY_BOOKING_PRODUCT_DATA_TYPE = {
  code: string;
  eventTime: Date;
  fromResellerId: string;
  globaltixTicketTypeId: string;
  image: string;
  index: number;
  issuedDate: Date;
  price: number;
  productId: string;
  productName: string;
  productOptionId: string;
  productOptionName: string;
  qrCode: string;
  quantity: number;
  ticketFormat: string;
  ticketTypeId: string;
  ticketTypeName: string;
  visitDate: Date;
  visitDateSettings: VISIT_DATE_TYPE[];
};

export type MY_BOOKING_DATA_TYPE = {
  alternateEmail: string;
  requiresManualConfirm: boolean;
  isManualHeld?: boolean | null; // OWNER-only
  isTicketConfirmed: boolean;
  customerName: string;
  eTicketUrl: string;
  email: string;
  globaltixTransactionId: number;
  groupName: string;
  id: string;
  isTicketReady: boolean;
  membersInGroup: number;
  mobileNumber: string;
  mobilePrefix: string;
  paidTime: Date;
  passportNumber: string;
  paymentDetail: PAYMENT_DETAIL_TYPE;
  paymentMethod: string;
  remarks: string;
  status: BOOKING_STATUS_ENUM;
  supplierStatus?: string | null; // OWNER-only
  bookingFailedApologySentAt?: string | null; // OWNER-only
  bookingFailedApologyVoucherCode?: string | null; // OWNER-only
  transactionRefNumber: string;
  transactedAmount: number;
  transactedBy: string;
  transactedTime: Date;
  viewTicketUrl: string;
  bookingTickets: MY_BOOKING_PRODUCT_DATA_TYPE[];
  guestEmail: string;
  guestName: string;
  guestPhone: string;
};

// Unified ticket + hotel booking list (myBookings query)
export type BookingKind = "HOTEL" | "TICKET";
export type BookingListBucket = "CANCELLED" | "COMPLETED" | "UPCOMING";
export type BookingFulfillmentStatus = "CONFIRMED" | "FAILED" | "PENDING";

export type CardVerificationStatus = "SENT" | "VERIFIED" | "FAILED" | "EXPIRED";
export type CardVerificationFilter = "NONE" | CardVerificationStatus;
export type CardVerificationFailureReason =
  | "DIFFERENT_CARD"
  | "NO_CODE"
  | "NOT_AUTHENTICATED"
  | "NOT_COMPLETED";

export type CardVerificationOwnerViewT = {
  status: CardVerificationStatus;
  sentAt?: string | null;
  expiresAt?: string | null;
  attemptsUsed: number;
  maxAttempts: number;
  verifiedAt?: string | null;
  failedAt?: string | null;
  lastFailureReason?: CardVerificationFailureReason | null;
  sendCount: number;
};

export type CardVerificationSendResultT = {
  transactionId: string;
  ok: boolean;
  code:
    | "SENT"
    | "ALREADY_VERIFIED"
    | "ATTEMPTS_USED"
    | "NOT_PAID"
    | "NOT_CARD_PAYMENT"
    | "NO_FINGERPRINT"
    | "NOT_FOUND"
    | "EMAIL_FAILED"
    | "TEST_ONLY";
  message: string;
};

export type BookingSummaryFindInputT = {
  page: number;
  limit: number;
  orderBy: {
    dir: "asc" | "desc";
    field?: string;
  };
  bucket?: BookingListBucket;
  status?: "PAID" | "PENDING" | "FAILED" | "EXPIRED";
  kind?: BookingKind;
  search?: string;
  /** ISO DateTime, inclusive */
  purchasedFrom?: string;
  /** ISO DateTime, exclusive */
  purchasedTo?: string;
  /** OWNER-only; NONE = never sent */
  cardVerificationStatus?: CardVerificationFilter;
};

export type BookingSummaryT = {
  id: string;
  kind: BookingKind;
  bucket: BookingListBucket;
  title: string;
  thumbnail?: string | null;
  amount: string;
  currencyCode: string;
  quantity: number;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  paymentStatus: BOOKING_STATUS_ENUM;
  fulfillmentStatus: BookingFulfillmentStatus;
  purchasedAt: string;
  relevantDate: string;
  expiresAt?: string | null;
  referenceNumber: string;
  supplierStatus?: string | null; // OWNER-only
  bookingFailedApologySentAt?: string | null; // OWNER-only
  bookingFailedApologyVoucherCode?: string | null; // OWNER-only
  cardVerification?: CardVerificationOwnerViewT | null; // OWNER-only
  voucherDiscountAmount: number;
  hotelDetail?: {
    id: string; // ETG reservation id — what bookingItinerary(id) expects, not the summary id
    checkin: string;
    checkout: string;
    nights: number;
    roomName?: string | null;
  } | null;
  ticketDetail?: {
    eTicketUrl: string;
    viewTicketUrl: string;
    isTicketReady: boolean;
    isManualHeld?: boolean; // OWNER-only, false for others
    requiresManualConfirm?: boolean;
  } | null;
};

export type BookingSummaryPagedOutputT = {
  data: BookingSummaryT[];
  total: number;
};
