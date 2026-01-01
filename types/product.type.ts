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
  extension: string;
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
  ticketType: TicketTypeT[];
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
}
