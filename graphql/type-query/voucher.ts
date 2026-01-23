import {
  VOUCHER_DISCOUNT_TYPE_ENUM,
  VOUCHER_STATUS_ENUM,
} from "@/types/voucher.type";

export interface GET_VOUCHER_LIST_DATA_TYPE {
  limit: number;
  orderBy: {
    dir: "asc" | "desc";
    field?: string | null;
  };
  status: VOUCHER_STATUS_ENUM | null;
  page: number;
  totalAmount?: number | null;
  totalQuantity?: number | null;
}

export interface VoucherCreateInputDTO {
  active: boolean;
  description: string;
  discountType: VOUCHER_DISCOUNT_TYPE_ENUM;
  discountValue: number;
  endDate: string | null;
  maximumAmount: number | null;
  minPurchase: number;
  minQuantity: number;
  name: string;
  startDate: string | null;
  usageLimit: number;
  specialDay: string | null;
  name_mm: string;
  description_mm: string;
}

export interface VoucherUpdateInputDTO {
  active: boolean;
  description: string;
  discountType: VOUCHER_DISCOUNT_TYPE_ENUM;
  discountValue: number;
  endDate: string | null;
  maximumAmount: number | null;
  minPurchase: number;
  minQuantity: number;
  name: string;
  startDate: string | null;
  usageLimit: number;
  specialDay: string | null;
  id: string;
  name_mm: string;
  description_mm: string;
}

export const GET_VOUCHER_LIST = `
query Query($params: VoucherPagedParam!) {
  findAllVouchers(params: $params) {
    total
    data {
      active
      available
      createdAt
      description
      description_mm
      discountType
      discountValue
      endDate
      id
      maximumAmount
      minPurchase
      minQuantity
      name
      name_mm
      specialDay
      startDate
      updatedAt
      usageLimit
    }
  }
}`;

export const SUBMIT_VOUCHER_MUTATION = `
mutation Mutation($data: VoucherCreateInputDTO!) {
  createVoucher(data: $data) {
    active
    createdAt
    description
    discountType
    id
  }
}`;

export const GET_VOUCHER_DETAIL_QUERY = `
query Query($findOneVoucherId: String!) {
  findOneVoucher(id: $findOneVoucherId) {
    active
    createdAt
    description
    description_mm
    discountType
    discountValue
    endDate
    id
    maximumAmount
    minPurchase
    minQuantity
    name
    name_mm
    specialDay
    startDate
    updatedAt
    usageLimit
  }
}`;

export const UPDATE_VOUCHER_MUTATION = `
mutation Mutation($data: VoucherUpdateInputDTO!) {
  updateVoucher(data: $data) {
    id
  }
}`;
