export type ResellerResT = {
  total: number;
  data: ResellerCreditT[];
};

export type ResellerCreditT = {
  balance: number;
  currency: string;
  id: string;
  totalUsage: number;
  updatedAt: string;
  totalTopUp: number;
  otherBalance: number[];
  lastMonthUsage: number;
  hasOutstandingDebt: boolean;
  createdAt: string;
  relatedImages?: string[];
};

export type ResellerT = {
  active:boolean;
  contactNo:string;
  createdAt:string;
  credit:{
    balance:string;
    currency:string;
    totalTopUp:string;
    totalUsage:string;
    hasOutstandingDebt: boolean;
    relatedImages?: string[];
    createdAt:string;
    updatedAt:string;
  }
  id:string;
  name:string;
  email:string;
};

export type CreateResellerPayloadT = {
  name: string;
  active: boolean;

  credit: {
    balance: number;
    currency: string;
    relatedImages: string[];
  };

  user: {
    contactNo: string;
    countryCode: string;
    email: string;
    username: string;
    password: string;
    imageURI: string;
  };
};
