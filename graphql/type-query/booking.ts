import { BOOKING_STATUS_ENUM } from "@/types/booking.type";

export interface BOOKING_CREATE_MUTATION_DATA_TYPE {
  cartItemIds: string[];
  customerName: string;
  email: string;
  mobileNumber: string | null;
  mobilePrefix: string | null;
  partnerReference: string | null;
  passportNumber: string | null;
  promoCodeId: string | null;
  promotionType: string | null;
  remarks: string | null;
  returnUri: string;
  twoFactorCode: string | null;
}

export interface GET_MY_BOOKING_QUERY_DATA_TYPE {
  limit: number;
  orderBy: ORDER_BY_DATA_TYPE;
  page: number;
  status: BOOKING_STATUS_ENUM;
}

export interface ORDER_BY_DATA_TYPE {
  dir: "asc" | "desc";
  field?: string | null;
}

export const BOOKING_CREATE_MUTATION = `
mutation Mutation($data: BookingCreateInputWithCart!) {
  createBookingWithCart(data: $data) {
    clientSecret
    stripeCSId
    transactionId
    transactionRefNumber
  }
}`;

export const GET_BOOKING_DETAIL = `
query GetTransactionDetailBy($data: FindBookingByInput!) {
  getTransactionDetailBy(data: $data) {
    alternateEmail
    isTicketConfirmed
    requiresManualConfirm
    voucherDiscountAmount
    expiresAt
    bookingTickets {
      code
      eventId
      eventTime
      fromResellerId
      globaltixTicketTypeId
      image
      index
      issuedDate
      price
      productId
      productName
      productOptionId
      productOptionName
      qrCode
      quantity
      questionList {
        answer
        id
        questionId
        ticketIndex
      }
      packageItemsMeta {
        attractionId
        attractionName
        id
        name
        quantity
        ticketTypeName
      }
      ticketFormat
      ticketTypeId
      ticketTypeName
      visitDate
      visitDateSettings {
        productId
        value
      }
    }
    customerName
    eTicketUrl
    email
    expiresAt
    globaltixTransactionId
    groupName
    guestEmail
    guestName
    guestPhone
    id
    isTicketReady
    membersInGroup
    mobileNumber
    mobilePrefix
    paidTime
    passportNumber
    paymentDetail {
      brand
      last4
      method
      stripeCSId
      stripeClientSecret
    }
    paymentMethod
    remarks
    status
    transactedAmount
    transactedBy
    transactedTime
    transactionRefNumber
    viewTicketUrl
  }
}`;

export const RESEND_EMAIL_MUTATION = `
mutation Mutation($data: ResendBookingEmailInput!) {
  resendBookingEmail(data: $data) {
    message
    status
  }
}`;

export const GET_MY_BOOKING_QUERY = `
query Query($params: BookingTransactionsInput!) {
  findAllTransactions(params: $params) {
    total
    data {
      alternateEmail
      requiresManualConfirm
      isTicketConfirmed
      isTicketReady
      bookingTickets {
        code
        productName
      }
      viewTicketUrl
      transactionRefNumber
      transactedTime
      transactedBy
      transactedAmount
      status
      remarks
      paymentMethod
      paymentDetail {
        brand
        last4
        method
        stripeCSId
        stripeClientSecret
      }
      passportNumber
      paidTime
      mobilePrefix
      mobileNumber
      membersInGroup
      isTicketReady
      id
      groupName
      customerName
      eTicketUrl
      email
      globaltixTransactionId
    }
  }
}`;

export const CONFIRM_BOOKING_MUTATION = `
mutation Mutation($data: ConfirmBookingInput!) {
  confirmBooking(data: $data) {
    message
    status
  }
}`;
