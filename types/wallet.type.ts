import { PaymentMethodT } from "./paymentMethod.type";

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

export type UserT = {
  id: string;
  email?: string;
  name: string;
  contactNo?: string | null;
  active: boolean;
};


export interface TopUpHistoryT {
  id: string;
  currency: string;
  relatedImages: string[];
  paymentMethod: PaymentMethodT;
  currencyRate:{
    id:string;
    mmk:string;
    createdAt:string;
    updatedAt:string;
  }
  createdBy: UserT;
  reseller: UserT
  confirmBy: UserT;
  status: string;
  topUpBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditInfoT {
  balance: number; //agent
  currency: string;
  hasOutstandingDebt: boolean;
  id: string;
  lastMonthUsage: number;
  customerBalance:number;
  gtBalance:number; //
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
  currencyRateId:string;
}
