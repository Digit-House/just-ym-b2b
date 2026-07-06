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
    findOneVoucher: VOUCHER_DETAIL_DATA_TYPE;
  };
}

export interface VOUCHER_DATA_TYPE {
  active: boolean;
  available: boolean;
  codePrefix: string | null;
  codesCount: number;
  // findAllVouchers' codes selection omits transactionId (findOneVoucher includes it).
  codes: Omit<VoucherCodeT, "transactionId">[];
  createdAt: string;
  description: string;
  description_mm: string;
  discountType: VOUCHER_DISCOUNT_TYPE_ENUM;
  discountValue: number;
  endDate: string;
  id: string;
  isCodeOnly: boolean;
  maximumAmount: number;
  message: string | null;
  minPurchase: number;
  minQuantity: number;
  name: string;
  name_mm: string;
  specialDay: VOUCHER_SPECIAL_DAY_ENUM;
  startDate: string;
  updatedAt: string;
  usageLimit: number;
  usedCount: number;
}

export interface VoucherCodeT {
  active: boolean;
  code: string;
  comment: string | null;
  createdAt: string;
  id: string;
  redeemedAt: string | null;
  redeemedByUserId: string | null;
  reservedByTransactionId: string | null;
  updatedAt: string;
  transactionId: string | null;
  voucherId: string;
}

// findOneVoucher returns the individual generated codes instead of the
// codesCount/usedCount/message/available summary fields findAllVouchers uses.
export interface VOUCHER_DETAIL_DATA_TYPE {
  active: boolean;
  codePrefix: string | null;
  codes: VoucherCodeT[];
  createdAt: string;
  description: string;
  description_mm: string;
  discountType: VOUCHER_DISCOUNT_TYPE_ENUM;
  discountValue: number;
  endDate: string;
  id: string;
  isCodeOnly: boolean;
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
