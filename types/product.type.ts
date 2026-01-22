import { BOOKING_STATUS_ENUM } from "./booking.type";
import z from "zod";
import { ticketSchema } from "./schema/ticketSchema";

export enum AVAILABILITY_ENUM {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "NOT_AVAILABLE",
}

export enum CART_ICON_ENUM {
  USER = "USER",
  TIME = "TIME",
  GUEST = "GUEST",
}

export type FindAllProductsT = {
  data: ProductT[];
  total: number;
};

export type FilterProductListT = {
  category: string;
  cityId: string;
  countryId: string;
  limit: number;
  orderBy: {
    field:string;
    dir: string;
  };
  page: number;
  published: "ALL" | "PUBLISHED" | "UNPUBLISHED";
};



export type ProductT = {
  category: string;
  city: string;
  description: string;
  dhSellingPrice: number;
  id: string;
  image: string;
  isPublished: boolean;
  isCancellable: boolean;
  media: [];
  name: string;
  originalPrice: number;
  price: number;
};

export interface ProductInfoResponse {
  data: {
    getProductInfo: ProductInfoT;
  };
}

export interface ProductOptionResponse {
  data: {
    user_product: {
      productOptions: ProductOptionT[];
    };
  };
}

export interface AddToCartResponse {
  data: {
    myCart: ADD_TO_CART_DATA_TYPE;
  };
}

export interface TicketTypeEventAvailableResponse {
  data: {
    checkEventAvailability: EVENT_AVAILABLE_DATA_TYPE[];
  };
}

export interface UpdateProductPayloadT {
  id: string;
  image: string;
  addressLine: string;
  category:string;
  description: string;
  description_mm: string;
  exclusions: string[];
  exclusions_mm: string[];
  fromPrice: number;
  fromReseller: string;
  highlights: string[];
  highlights_mm: string[];
  howToUseList: string[];
  howToUseList_mm: string[];
  inclusions: string[];
  inclusions_mm: string[];
  isBestSeller: boolean;
  isCancellable: boolean;
  isGTRecommend: boolean;
  isInstantConfirmation: boolean;
  isOpenDated: boolean;
  isOwnContracted: boolean;
  isPublished: boolean;
  keywords: string;
  latitude: number;
  location: string;
  longitude: number;
  media: MediaFileT[];
  name: string;
  operatingHours: OperatingHoursT;
  originalPrice: number;
  postalCode: string;
  productOptions: ProductOptionT[];
  termsAndConditions: string;
  termsAndConditions_mm: string;
  thingsToNote: string[];
  thingsToNote_mm: string[];
  timezoneOffset: number;
  whatToExpect: string;
  whatToExpect_mm: string;
  blockedDate: BlockedDateT[];
}

export interface ProductInfoT {
  id: string;
  name: string;
  category: string;
  description: string;
  description_mm: string;
  whatToExpect: string;
  whatToExpect_mm: string;
  addressLine: string;
  location: string;
  postalCode: string;
  city: string;
  cityId: number;
  city_relation_id: string;
  countryId: string;
  latitude: number;
  longitude: number;
  keywords: string;
  image: string;
  exclusions: string[];
  exclusions_mm: string[];
  highlights: string[];
  highlights_mm: string[];
  howToUseList: string[];
  howToUseList_mm: string[];
  inclusions: string[];
  inclusions_mm: string[];
  thingsToNote: string[];
  thingsToNote_mm: string[];
  isBestSeller: boolean;
  isCancellable: boolean;
  isGTRecommend: boolean;
  isPublished: boolean;
  isInstantConfirmation: boolean;
  isOpenDated: boolean;
  originalPrice: number;
  timezoneOffset: number;
  createdAt: string;
  updatedAt: string;
  blockedDate: BlockedDateT[];
  media: MediaFileT[];
  operatingHours: OperatingHoursT;
  termsAndConditions: string;
  termsAndConditions_mm: string;
  productOptions: ProductOptionT[];
}

export interface BlockedDateT {
  date: string;
  title: string;
}

export interface MediaFileT {
  extension: "jpeg" | "png" | null;
  isPublished: boolean | null;
  name: string | null;
  path: string | null;
  size: number | null;
  type: string | null;
}

export interface OperatingHoursT {
  custom: string | null;
  isToursActivities: boolean | null;
  fixedDays: FixedDayT[];
}

export interface FixedDayT {
  day: string;
  startHour: string;
  endHour: string;
}

export interface ProductOptionT {
  id: string;
  name: string;
  description: string;
  isPublished: boolean;
  ticketType: TicketTypeT[];
  advanceBooking: AdvanceBookingT | null;
  isCapacity: boolean;
  questions: ProductOptionQuestionT[];
  visitDate: VisitDateT;
  inclusions: string[];

  // createdAt: Date;
  // currency: string;
  // definedDuration: string;
  // demandType: string;
  // description: string;

  // isDynamicPricing: boolean;
  // isTagged: boolean;
  // keywords: string;
  // name: string;
  // primaryTicket: string;
  // productId: string;
  // publishStart: Date;

  // redeemEnd: Date;
  // redeemStart: Date;
  // ticketFormat: string;
  // ticketValidity: string;
  // timeSlot: string[];
  // tourInformation: string[];
  // type: string;
  // updatedAt: Date;
  // publishEnd: Date;
  // advanceBooking: AdvanceBookingT | null;
  // availability: AVAILABILITY_ENUM | null;
}

export interface TicketTypeT {
  id: string;
  name: string;
  dhNetPrice: number;
  dhRecommendedSellingPrice: number;
  recommendedSellingPrice: number;
  minimumSellingPrice: number;
  dhSellingPrice: number;
  nettPrice: number;
  quantity: number;
  originalPrice: number;
  maxPurchaseQty: number;
  minPurchaseQty: number;
  createdAt: string;
  ageTo: number;
  ageFrom: number;
  updatedAt: string;
  globaltixId: string;

  // sku: string;
  // globaltixId: number;
  // issuanceLimit: number | null;
  // maxPurchaseQty: number | null;
  // minPurchaseQty: number | null;
  // useBin: boolean;
  // applyToAllQna: boolean;
  // ageFrom: number | null;
  // ageTo: number | null;
  // similarTicketId: number | null;
}

export interface AdvanceBookingT {
  day: number;
  dayMinute: number;
  hour: number;
  minute: number;
  required: boolean;
}

export interface ProductOptionQuestionT {
  cartItemId: string;
  createdAt: Date;
  globaltixId: string;
  id: string;
  isAnswerLater: boolean;
  optionCode: string;
  optional: boolean;
  optionList: OptionT[];
  options: string[];
  question: string;
  questionCode: string;
  type: string;
  updatedAt: Date;
}

export interface VisitDateT {
  isOpenDated: boolean;
  request: boolean;
  required: boolean;
}

export interface OptionT {
  key: string;
  value: string;
}

export interface EventAvailableDataT {
  available: number;
  enableEmp: boolean;
  id: number;
  isAdHoc: boolean;
  isInactive: boolean;
  seriesId: number;
  seriesName: string;
  time: string;
  total: number;
  unlimited: number;
  used: number;
}

export interface SelectedProductOptionT {
  id: string;
  ticketType: TicketTypeT[];
  totalPrice: number;
  name: string;
  questions: ProductOptionQuestionT[];
  visitDate: VisitDateT;
  isCapacity: boolean;
}

export type QusetionT = {
  answer: string;
  id: string;
};

export interface AnswerT {
  cartItemId: string | null;
  eventId: string | null;
  eventTime: string | null;
  quantity: number;
  questionList: QusetionT[];
  ticketTypeId: string;
  visitDate: string;
}

export interface GuestInfoT {
  ticket: TicketTypeT;
  guestIndex: number;
  ticketIndex: number;
  isFilled: boolean;
}

export interface EVENT_AVAILABLE_DATA_TYPE {
  available: number;
  enableEmp: boolean;
  id: number;
  isAdHoc: boolean;
  isInactive: boolean;
  seriesId: number;
  seriesName: string;
  time: string;
  total: number;
  unlimited: number;
  used: number;
}

export type ADD_TO_CART_USER_TYPE = {
  name: string;
  email: string;
  phone: string;
  sameAsLeader: boolean;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
};

export type ADD_TO_CART_ITEM_DATA_TYPE = {
  currency: string;
  eventId: number;
  eventTime: string;
  globaltixTicketTypeId: number;
  id: string;
  image: string;
  price: number;
  productId: string;
  productName: string;
  productOptionId: string;
  productOptionName: string;
  quantity: number;
  questionIds: string[];
  ticketTypeId: string;
  ticketTypeName: string;
  visitDate: string;
};

export type ADD_TO_CART_DATA_TYPE = {
  id: string;
  items: ADD_TO_CART_ITEM_DATA_TYPE[];
};
