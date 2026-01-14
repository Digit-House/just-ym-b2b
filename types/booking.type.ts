export enum BOOKING_STATUS_ENUM {
  FAILED = "FAILED",
  PAID = "PAID",
  PENDING = "PENDING",
}

export type PAYMENT_DETAIL_TYPE = {
  brand: string;
  last4: string;
  method: string;
  stripeCSId: string;
  stripeClientSecret: string;
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
  booked: boolean;
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
