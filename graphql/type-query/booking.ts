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
    requiresManualConfirm
    isManualHeld
    isTicketConfirmed
    isTicketReady
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
    supplierStatus
    bookingFailedApologySentAt
    bookingFailedApologyVoucherCode
    transactedAmount
    transactedBy
    transactedTime
    transactionRefNumber
    viewTicketUrl
  }
}`;

export const SEND_BOOKING_FAILED_APOLOGY_MUTATION = `
mutation SendBookingFailedApologyEmail($transactionId: String!, $voucherCode: String) {
  sendBookingFailedApologyEmail(transactionId: $transactionId, voucherCode: $voucherCode) {
    sentAt
    voucherCode
  }
}`;

export const RESEND_EMAIL_MUTATION = `
mutation Mutation($data: ResendBookingEmailInput!) {
  resendBookingEmail(data: $data) {
    message
    status
  }
}`;

// The card-check field is requested for OWNER only.
const myBookingsQuery = (owner: boolean) => `
query MyBookings($params: BookingSummaryFindInput!) {
  myBookings(params: $params) {
    total
    data {
      id
      kind
      bucket
      title
      thumbnail
      amount
      currencyCode
      quantity
      customerName
      customerEmail
      customerPhone
      paymentStatus
      fulfillmentStatus
      purchasedAt
      relevantDate
      expiresAt
      referenceNumber
      supplierStatus
      bookingFailedApologySentAt
      bookingFailedApologyVoucherCode
      voucherDiscountAmount${
        owner
          ? `
      cardVerification {
        status
        sentAt
        expiresAt
        attemptsUsed
        maxAttempts
        verifiedAt
        failedAt
        lastFailureReason
        sendCount
      }`
          : ""
      }
      hotelDetail {
        id
        checkin
        checkout
        nights
        roomName
      }
      ticketDetail {
        eTicketUrl
        viewTicketUrl
        isTicketReady
        isManualHeld
        requiresManualConfirm
      }
    }
  }
}`;

export const MY_BOOKINGS_QUERY = myBookingsQuery(false);
export const MY_BOOKINGS_OWNER_QUERY = myBookingsQuery(true);

export const SEND_CARD_VERIFICATION_MUTATION = `
mutation SendCardVerification($input: SendCardVerificationInput!) {
  sendCardVerification(input: $input) {
    transactionId
    ok
    code
    message
  }
}`;

export const GET_MY_BOOKING_QUERY = `
query Query($params: BookingTransactionsInput!) {
  findAllTransactions(params: $params) {
    total
    data {
      alternateEmail
      requiresManualConfirm
      isManualHeld
      isTicketConfirmed
      isTicketReady
      bookingTickets {
        code
        productName
        quantity
        visitDate
        image
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

export const REFRESH_BOOKING_MUTATION = `
mutation Mutation($data: RefreshBookingInput!) {
  refreshBooking(data: $data) {
    eTicketUrl
    isTicketReady
  }
}`;

export const UPLOAD_BOOKING_VOUCHER_MUTATION = `
mutation Mutation($data: UploadBookingVoucherInput!) {
  uploadBookingVoucher(data: $data) {
    eTicketUrl
    isTicketReady
  }
}`;
