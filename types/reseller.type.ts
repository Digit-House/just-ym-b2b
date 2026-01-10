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
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  credit: ResellerCreditT;
};

export type CreateResellerPayloadT = {
  name: string;
  credit: {
    balance: number;
    currency: string;
    relatedImages: string[] | null;
  };
};
