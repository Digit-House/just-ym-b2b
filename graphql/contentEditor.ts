import { warpGql } from "@/util";
import client from "./client";
import {
  AUDIT_LOGS,
  CONTENT_PRODUCTS,
  PRODUCT_CONTENT,
  RESOLVE_SUPPLIER_UPDATE,
  SUPPLIER_UPDATES,
  UPDATE_PRODUCT_CONTENT,
} from "./type-query/contentEditor";
import {
  AuditFilterT,
  AuditLogT,
  ContentListItemT,
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
  filter: { name?: string; hasPendingUpdates?: boolean },
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

export const resolveSupplierUpdate = async (
  id: string,
  action: SupplierUpdateAction,
  mergedValue?: unknown
) => {
  const res: any = await client.mutate({
    mutation: warpGql(RESOLVE_SUPPLIER_UPDATE),
    variables: { id, action, mergedValue },
  });
  return res.data;
};

export const getAuditLogs = async (
  filter: AuditFilterT,
  page: { page: number; limit: number }
) =>
  (
    await query<{ auditLogs: { total: number; items: AuditLogT[] } }>(
      AUDIT_LOGS,
      { filter, page }
    )
  ).auditLogs;
