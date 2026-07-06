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

export interface VoucherClaimT {
  createdAt: string;
  id: string;
  transactionId: string;
  userId: string;
  voucherId: string;
  year: number;
}

export interface VoucherCodeT {
  voucherId: string;
  active: boolean;
  code: string;
  comment: string | null;
  createdAt: string;
  id: string;
  redeemedAt: string | null;
  redeemedByUserId: string | null;
  reservedByTransactionId: string | null;
  transactionId: string | null;
  updatedAt: string;
}

// The voucher nested inside each code entry (one level deep, no further nesting)
export interface VoucherNestedT {
  active: boolean;
  claims: Pick<VoucherClaimT, "createdAt" | "id" | "transactionId">[];
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

export interface VoucherCodeWithVoucherT extends VoucherCodeT {
  voucher: VoucherNestedT;
}

export interface VOUCHER_DATA_TYPE {
  active: boolean;
  available: boolean;
  claims: VoucherClaimT[];
  codePrefix: string | null;
  codes: VoucherCodeWithVoucherT[];
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
