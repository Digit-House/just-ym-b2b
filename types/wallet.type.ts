
export interface WalletStateT {
  balance: number;
  totalTopUps: number;
  totalSpent: number;
}

export interface TopUpHistoryFilterT {
  limit: number;
  orderBy: {
    dir: string;
  };
  page: number;
  status: null | string;
}

export interface TopUpHistoryT {
  id: string;
  currency: string;
  relatedImages: string[];
  createdBy: {
    id: string;
    active: boolean;
    contactNo: string;
    email: string;
  };
  reseller: {
    id: string;
    active: boolean;
    name: string;
  };
  confirmBy: {
    id: string;
    email: string;
    countryCode: string;
    contactNo: string;
    active: boolean;
  };
  status: string;
  topUpBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditInfoT {
  balance: number;
  currency: string;
  hasOutstandingDebt: boolean;
  id: string;
  lastMonthUsage: number;
  otherBalance: any;
  totalTopUp: number;
  totalUsage: number;
}

export interface AddTopupPayloadT {
  currency: "THB";
  resellerId: string;
  topUpBalance: number;
  relatedImages: string[];
}
