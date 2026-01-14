
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
    email: string;
    contactNo: string;
    active: boolean;
    username:string;
  };
  reseller: {
    id: string;
    active: boolean;
    name: string;
  };
  confirmBy: {
    id: string;
    email: string;
    contactNo: string;
    active: boolean;
    username:string;
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
  paymentMethodId:string;
}
