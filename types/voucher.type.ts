export enum VOUCHER_DISCOUNT_TYPE_ENUM {
  PERCENTAGE = "PERCENTAGE",
  AMOUNT = "AMOUNT",
}

export enum VOUCHER_SPECIAL_DAY_ENUM {
  BIRTHDAY = "BIRTHDAY",
}

export enum VOUCHER_STATUS_ENUM {
  CLAIMED = "CLAIMED",
  TO_CLAIM = "TO_CLAIM",
  TO_USE = "TO_USE",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface VoucherListInfoT {
  data: {
    findAllVouchers: {
      total: number;
      data: VOUCHER_DATA_TYPE[];
    };
  };
}

export interface VoucherDetailResponse {
  data: {
    findOneVoucher: VOUCHER_DATA_TYPE;
  };
}

export interface VOUCHER_DATA_TYPE {
  active: boolean;
  available: boolean;
  createdAt: string;
  description: string;
  description_mm: string;
  discountType: VOUCHER_DISCOUNT_TYPE_ENUM;
  discountValue: number;
  endDate: string;
  id: string;
  maximumAmount: number;
  minPurchase: number;
  minQuantity: number;
  name: string;
  name_mm: string;
  specialDay: VOUCHER_SPECIAL_DAY_ENUM;
  startDate: string;
  updatedAt: string;
  usageLimit: number;
}
