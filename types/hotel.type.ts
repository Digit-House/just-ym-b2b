// Mirrors the backend's Etg* GraphQL schema (hotelSearchByRegion / hotelMulticomplete / hotelpageV2)

export type HotelSortBy =
  | "price_asc"
  | "price_desc"
  | "star_rating_asc"
  | "star_rating_desc";

export type HotelGuestInput = {
  adults: number;
  children: number[];
};

export type HotelSearchFilterInput = {
  star_rating?: number[];
  price_from?: number;
  price_to?: number;
  meal_type?: string[];
  free_cancellation?: boolean;
  bedding?: string[];
  room_amenities?: string[];
  serp_filters?: string[];
};

export type HotelSearchRegionInput = {
  region_id: number;
  checkin: string;
  checkout: string;
  guests: HotelGuestInput[];
  residency: string;
  language?: string;
  page?: number;
  limit?: number;
  hotels_limit?: number;
  sort_by?: HotelSortBy;
  filter?: HotelSearchFilterInput;
};

export type HotelRegionMetaT = {
  id?: number;
  name?: string;
  country_name?: string;
  country_code?: string;
  type?: string;
};

export type HotelRateT = {
  room_name: string;
  bedding: string[];
  meal_type?: string;
  has_breakfast?: boolean;
  free_cancellation_before?: string;
  show_amount?: string;
  show_amount_per_night?: string;
  show_currency_code?: string;
  room_amenities: string[];
};

export type HotelSearchResultT = {
  hid: number;
  id: string;
  name: string;
  address?: string;
  star_rating?: number;
  images: string[] | null;
  kind?: string;
  isRecommended?: boolean | null;
  region_meta?: HotelRegionMetaT;
  rates: HotelRateT[];
};

export type HotelSearchByRegionResultT = {
  hotels: HotelSearchResultT[];
  total_hotels: number;
  page: number;
  limit: number;
  nextPage?: number;
};

export type HotelSuggestionRegionT = {
  id: number;
  name: string;
  type: string;
  country_name?: string;
  country_code: string;
};

export type HotelSuggestionHotelT = {
  id: string;
  hid?: number;
  name: string;
  address?: string;
  city_name?: string;
  country_name?: string;
  region_id: number;
};

export type HotelMulticompleteResultT = {
  regions: HotelSuggestionRegionT[];
  hotels: HotelSuggestionHotelT[];
};

export type HotelDescriptionSectionT = {
  title: string;
  paragraphs: string[];
};

export type HotelAmenityGroupT = {
  group_name: string;
  amenities: string[];
  non_free_amenities: string[];
};

export type HotelInfoT = {
  id?: string;
  hid?: number;
  name?: string;
  address?: string;
  star_rating?: number;
  images: string[] | null;
  latitude?: number;
  longitude?: number;
  check_in_time?: string;
  check_out_time?: string;
  phone?: string;
  description_struct: HotelDescriptionSectionT[];
  amenity_groups: HotelAmenityGroupT[];
  region_meta?: HotelRegionMetaT;
};

export type HotelRoomRatePaymentTypeT = {
  type: string;
  show_amount?: string;
  show_currency_code?: string;
  cancellation_penalties?: { free_cancellation_before?: string | null } | null;
};

export type HotelRoomDataTransT = {
  main_name?: string;
  bedding_type?: string | null;
  main_room_type?: string;
};

export type HotelRoomRateT = {
  room_name: string;
  book_hash: string;
  amenities_data?: string[];
  room_data_trans?: HotelRoomDataTransT;
  meal_data?: { has_breakfast?: boolean; value?: string };
  payment_types: HotelRoomRatePaymentTypeT[];
};

export type HotelRoomTypeT = {
  key: string;
  name: string;
  images: string[];
  room_amenities: string[];
  rates: HotelRoomRateT[];
};

export type HotelPageV2ResultT = {
  hotel: {
    hid: number;
    id?: string;
    room_types: HotelRoomTypeT[];
  } | null;
  hotel_info: HotelInfoT | null;
};

// UI-level search/filter state, persisted locally (mirrors useTicketFilters)
export type HotelSearchState = {
  destinationLabel: string;
  regionId: number | null;
  checkin: string; // yyyy-MM-dd
  checkout: string; // yyyy-MM-dd
  guests: HotelGuestInput[]; // one entry per room; children = array of ages
  residency: string; // lowercase ISO alpha-2, e.g. "th"
  residencyLabel: string;
  starRating: string[];
  mealType: string[];
  freeCancellationOnly: boolean;
  priceFrom?: number;
  priceTo?: number;
  sort: HotelSortBy;
};

// The rate the guest picked on the hotel detail page, carried into the booking/guest-info flow.
export type HotelBookingSelectionT = {
  hotelId: string;
  bookHash: string;
  roomName: string;
  hotelName: string;
  hotelImage: string;
  checkin: string;
  checkout: string;
  residency: string;
  residencyLabel: string;
  guests: HotelGuestInput[]; // one entry per room; children = array of ages
  amount?: string;
  currency?: string;
};

export type HotelBookingGuestT = {
  firstName: string;
  lastName: string;
  age: number | null; // null for adults; a fixed known age for children (set during search)
};

export type HotelBookingContactInfoT = {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  nationalityLabel: string;
  arrivalTime: string;
};

// Mirrors the backend's CreateEtgHotelReservationInput / *Output (createHotelReservation mutation)
export type EtgHotelBookingGuestInputT = {
  first_name: string;
  last_name: string;
  age?: number;
  is_child?: boolean;
  gender?: string;
};

export type EtgHotelBookingRoomInputT = {
  guests: EtgHotelBookingGuestInputT[];
};

export type EtgHotelBookingContactInputT = {
  email: string;
  phone: string;
  comment?: string;
};

// Server default is STRIPE, but the field is non-nullable in the schema so it must always
// be sent explicitly. This app doesn't collect card/QR details in-app, so we always send
// the default rather than exposing a picker (see HotelCheckout.tsx).
export type HotelPaymentMethod = "STRIPE" | "AYAPAY" | "CREDIT";

export type CreateEtgHotelReservationInputT = {
  book_hash: string;
  checkin: string;
  checkout: string;
  language: string;
  paymentMethod?: HotelPaymentMethod | null;
  returnUri?: string;
  rooms: EtgHotelBookingRoomInputT[];
  user: EtgHotelBookingContactInputT;
  twoFactorCode: string | null; // only required for OWNER users with 2FA enabled
};

export type HotelPaymentDetailT = {
  amount?: number;
  brand?: string;
  last4?: string;
  method?: string;
  mmqrdata?: string;
  paymentIntentClientSecret?: string;
  paymentIntentId?: string;
  paymentStatus?: string;
  qrdata?: string;
  referenceNumber?: string;
  status?: string;
  stripeCSId?: string;
  stripeClientSecret?: string;
};

export type EtgHotelBookingStatus =
  | "CONFIRMED"
  | "FAILED"
  | "PROCESSING"
  | "RESERVED";

export type EtgTransactionStatus = "EXPIRED" | "FAILED" | "PAID" | "PENDING";

export type EtgHotelBookingOutputT = {
  id: string;
  bookingStatus: EtgHotelBookingStatus;
  status: EtgTransactionStatus;
  checkin: string;
  checkout: string;
  currencyCode: string;
  paymentAmount: number;
  createdAt: string;
  expiresAt: string;
  hid: number;
  hotelStaticId?: string;
  hotelThumbnail?: string;
  paymentDetail?: HotelPaymentDetailT | null;
};

export type CreateEtgHotelReservationOutputT = {
  priceChanged: boolean;
  reservation: EtgHotelBookingOutputT | null;
  updatedRates: { room_name: string; book_hash: string }[];
};

// Mirrors EtgCustomerBookingItineraryOutput (bookingItinerary query) — the confirmation
// page's data source. The voucher PDF is generated asynchronously: poll while voucherStatus
// is GENERATING; voucherUrl is only set once READY.
export type HotelVoucherStatus = "GENERATING" | "READY";

export type EtgItineraryGuestOutputT = {
  firstName: string;
  lastName: string;
  isChild: boolean;
};

export type EtgItineraryRoomOutputT = {
  adults: number;
  children: number;
  beddingName: string[];
  guests: EtgItineraryGuestOutputT[];
  hasBreakfast?: boolean | null;
  mealName?: string | null;
};

export type EtgItineraryCancellationTierT = {
  customerPenaltyAmount: number;
  penaltyCurrency: string;
  startAt?: string | null;
  endAt?: string | null;
};

export type EtgCustomerBookingItineraryOutputT = {
  id: string;
  bookingStatus: string;
  status: string;
  checkin: string;
  checkout: string;
  nights: number;
  createdAt: string;
  currencyCode: string;
  paymentAmount: string;
  hid: number;
  hotelName?: string | null;
  hotelStaticId?: string | null;
  hotelThumbnail?: string | null;
  hotelConfirmationNumber?: string | null;
  partnerOrderId: string;
  roomName?: string | null;
  rooms: EtgItineraryRoomOutputT[];
  freeCancellationBefore?: string | null;
  isCancellable: boolean;
  cancellationSchedule: EtgItineraryCancellationTierT[];
  paymentDetail?: HotelPaymentDetailT | null;
  voucherStatus: HotelVoucherStatus;
  voucherUrl?: string | null;
};
