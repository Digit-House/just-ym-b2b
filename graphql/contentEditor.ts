import { warpGql } from "@/util";
import client from "./client";
import { AUDIT_SAVES, UPDATE_PRODUCT_CONTENT } from "./type-query/contentEditor";
import {
  CONTENT_PRODUCTS_REVIEW as CONTENT_PRODUCTS,
  PRODUCT_CONTENT_REVIEW as PRODUCT_CONTENT,
  SUPPLIER_UPDATES_REVIEW as SUPPLIER_UPDATES,
  resolveSupplierUpdateChecked,
} from "./contentEditorReview";
import {
  AuditFilterT,
  AuditSaveT,
  ContentListItemT,
  ContentReviewStatus,
  ProductContentT,
  SupplierUpdateAction,
  SupplierUpdateT,
} from "@/types/contentEditor.type";

const query = async <T>(q: string, variables: Record<string, unknown>) => {
  const res: any = await client.query({
    query: warpGql(q),
    variables,
    fetchPolicy: "no-cache",
  });
  return res.data as T;
};

export const getContentProducts = async (
  filter: {
    name?: string;
    hasPendingUpdates?: boolean;
    categoryIds?: string[];
    countryId?: string;
    isPublished?: boolean;
    reviewStatus?: ContentReviewStatus;
    reviewNotStarted?: boolean;
    orderBy?: { field: string; dir: "asc" | "desc" };
  },
  page: { page: number; limit: number }
) =>
  (
    await query<{ contentProducts: { total: number; data: ContentListItemT[] } }>(
      CONTENT_PRODUCTS,
      { filter, page }
    )
  ).contentProducts;

export const getProductContent = async (id: string) =>
  (await query<{ productContent: ProductContentT }>(PRODUCT_CONTENT, { id }))
    .productContent;

export const updateProductContent = async (input: Record<string, unknown>) => {
  const res: any = await client.mutate({
    mutation: warpGql(UPDATE_PRODUCT_CONTENT),
    variables: { input },
  });
  return res.data;
};

export const getSupplierUpdates = async (
  productId: string,
  status: SupplierUpdateT["status"] = "PENDING"
) =>
  (
    await query<{ supplierUpdates: SupplierUpdateT[] }>(SUPPLIER_UPDATES, {
      productId,
      status,
    })
  ).supplierUpdates;

export const resolveSupplierUpdate = (
  id: string,
  action: SupplierUpdateAction,
  mergedValue?: unknown,
  expectedSupplierValue?: unknown
) => resolveSupplierUpdateChecked(id, action, mergedValue, expectedSupplierValue);

export const getAuditSaves = async (
  filter: AuditFilterT,
  page: { page: number; limit: number }
) =>
  (
    await query<{ auditSaves: { total: number; truncated: boolean; items: AuditSaveT[] } }>(
      AUDIT_SAVES,
      { filter, page }
    )
  ).auditSaves;
