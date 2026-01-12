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
    dir: string;
  };
  page: number;
};

export type ProductT = {
  category: string;
  city: string;
  description: string;
  dhSellingPrice: number;
  id: string;
  image: string;
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

export interface TicketTypeEventAvailableResponse {
  data: {
    checkEventAvailability: EVENT_AVAILABLE_DATA_TYPE[];
  };
}

export interface UpdateProductPayloadT {
  id:string;
  image:string;
  addressLine:string;
  description:string;
  exclusions:string[];
  exclusions_mm:string[];
  fromPrice:number;
  fromReseller:string;
  highlights:string[];
  highlights_mm:string[]
  howToUseList:string[];
  howToUseList_mm:string[];
  inclusions:string[];
  inclustions_mm:string[];
  isBestSeller:boolean;
  isCancellable:boolean;
  isGTRecommend:boolean;
  isInstantConfirmation:boolean;
  isOpenDated:boolean;
  isOwnContracted:boolean;
  isPublished:boolean;
  keywords:string;
  latitude:number;
  location:string;
  longitude:number;
  media:MediaFileT[];
  name:string;
  operatingHours: OperatingHoursT;
  originalPrice:number;
  postalCode:string;
  productOptions: ProductOptionT[];
  termsAndConditions:string;
  termsAndConditions_mm:string;
  thingsToNote: string[];
  thingsToNode_mm:string[];
  timezoneOffset:number;
  whatToExpect:string;
  blockedDate: BlockedDateT[];
}


export interface ProductInfoT {
  id: string;
  name: string;
  category: string;
  description: string;
  whatToExpect: string;
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
  highlights: string[];
  howToUseList: string[];
  inclusions: string[];
  thingsToNote: string[];
  isBestSeller: boolean;
  isCancellable: boolean;
  isGTRecommend: boolean;
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
  productOptions: ProductOptionT[];
}

export interface BlockedDateT {
  date: string;
  title: string;
}

export interface MediaFileT {
  extension: "jpeg" | "png";
  isPublished:boolean;
  name: string;
  path: string;
  size: number;
  type: string;
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
  createdAt: Date;
  currency: string;
  definedDuration: string;
  demandType: string;
  description: string;
  id: string;
  inclusions: string[];
  isDynamicPricing: boolean;
  isTagged: boolean;
  keywords: string;
  name: string;
  primaryTicket: string;
  productId: string;
  publishStart: Date;
  isCapacity: boolean;
  redeemEnd: Date;
  redeemStart: Date;
  ticketFormat: string;
  ticketType: TicketTypeT[];
  ticketValidity: string;
  timeSlot: string[];
  tourInformation: string[];
  type: string;
  updatedAt: Date;
  publishEnd: Date;
  questions: ProductOptionQuestionT[];
  visitDate: VisitDateT;
  advanceBooking: AdvanceBookingT | null;
  availability: AVAILABILITY_ENUM | null;
}



export interface TicketTypeT {
  id: string;
  name: string;
  sku: string;
  globaltixId: number;
  issuanceLimit: number | null;
  maxPurchaseQty: number | null;
  minPurchaseQty: number | null;
  useBin: boolean;
  applyToAllQna: boolean;
  ageFrom: number | null;
  ageTo: number | null;
  nettPrice: number;
  dhNetPrice: number;
  dhSellingPrice: number;
  dhRecommendedSellingPrice: number;
  originalPrice: number;
  similarTicketId: number | null;
  createdAt: string;
  updatedAt: string;
  quantity: number;
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


