import { warpGql } from "@/util";
import client from "./client";
import {
  ArchiveKind,
  AuditArchiveT,
  ContentReviewCountsT,
  ContentReviewStatus,
  SupplierUpdateAction,
} from "@/types/contentEditor.type";

const REVIEW_META = "editedFields alwaysReviewFields supplierBaseline pendingSupplierUpdates";

export const CONTENT_PRODUCTS_REVIEW = `
query ContentProducts($filter: ContentProductsFilterInput, $page: PageInput) {
  contentProducts(filter: $filter, page: $page) {
    total
    data { id name image city category isPublished pendingSupplierUpdates contentReviewStatus }
  }
}
`;

export const PRODUCT_CONTENT_REVIEW = `
query ProductContent($id: ID!) {
  productContent(id: $id) {
    id name slug description description_mm whatToExpect whatToExpect_mm
    termsAndConditions termsAndConditions_mm
    highlights highlights_mm inclusions inclusions_mm exclusions exclusions_mm
    howToUseList howToUseList_mm thingsToNote thingsToNote_mm
    goodToKnow keywords productKeywords image
    media { extension name path size type }
    location addressLine postalCode latitude longitude
    category city country isPublished isRecommended isBestSeller isCancellable
    requiresManualConfirmation position
    ${REVIEW_META}
    contentReviewStatus contentReviewSubmittedAt contentReviewSentBackAt
    productOptions {
      id name description description_mm termsAndConditions termsAndConditions_mm image
      howToUse howToUse_mm inclusions inclusions_mm exclusions exclusions_mm
      tourInformation cancellationNotes
      isPublished isCancellable ticketValidity timeSlot sortOrder deletedAt
      ${REVIEW_META}
      ticketTypes {
        id name ageFrom ageTo minPurchaseQty maxPurchaseQty deletedAt
        supplierOriginalPrice customOriginalPrice ${REVIEW_META}
      }
    }
  }
}
`;

export const SUPPLIER_UPDATES_REVIEW = `
query SupplierUpdates($productId: ID!, $status: SupplierUpdateStatus) {
  supplierUpdates(productId: $productId, status: $status) {
    id entityName entityId productId field baselineValue supplierValue status createdAt location locationIds
  }
}
`;

export const RESOLVE_SUPPLIER_UPDATE_REVIEW = `
mutation ResolveSupplierUpdate($id: ID!, $action: SupplierUpdateAction!, $mergedValue: JSON, $expectedSupplierValue: JSON) {
  resolveSupplierUpdate(id: $id, action: $action, mergedValue: $mergedValue, expectedSupplierValue: $expectedSupplierValue) { id status }
}
`;

export const AUDIT_LOGS_REVIEW = `
query AuditLogs($filter: AuditLogFilterInput, $page: PageInput) {
  auditLogs(filter: $filter, page: $page) {
    total
    items {
      id action entityName entityId productId source oldValues newValues
      user { id name email } createdAt location locationIds
    }
  }
}
`;

const SUBMIT = `mutation SubmitContentForReview($productId: ID!) { submitContentForReview(productId: $productId) { id contentReviewStatus contentReviewSubmittedAt } }`;
const APPROVE = `mutation ApproveContentReview($productId: ID!) { approveContentReview(productId: $productId) { id contentReviewStatus isPublished } }`;
const SEND_BACK = `mutation SendBackContentReview($productId: ID!) { sendBackContentReview(productId: $productId) { id contentReviewStatus } }`;
const REFRESH = `mutation RefreshProductContent($productId: ID!) { refreshProductContent(productId: $productId) { status message } }`;
const COUNTS = `query ContentReviewCounts { contentReviewCounts { readyForReview sentBack } }`;
const ALWAYS_REVIEW = `mutation SetAlwaysReviewFields($entityName: String!, $entityId: ID!, $fields: [String!]!) {
  setAlwaysReviewFields(entityName: $entityName, entityId: $entityId, fields: $fields) { id }
}`;
const ARCHIVES = `query AuditArchives { auditArchives { id month keys auditCount supplierUpdateCount createdAt } }`;
const ARCHIVE_URL = `query AuditArchiveDownloadUrl($month: String!, $kind: String!) { auditArchiveDownloadUrl(month: $month, kind: $kind) }`;

const mutate = async <T>(m: string, variables: Record<string, unknown>) =>
  ((await client.mutate({ mutation: warpGql(m), variables })) as any).data as T;
const query = async <T>(q: string, variables: Record<string, unknown> = {}) =>
  ((await client.query({ query: warpGql(q), variables, fetchPolicy: "no-cache" })) as any).data as T;

export const submitContentForReview = (productId: string) =>
  mutate<{ submitContentForReview: { id: string; contentReviewStatus: ContentReviewStatus } }>(SUBMIT, { productId });
/** Owner only. */
export const approveContentReview = (productId: string) => mutate(APPROVE, { productId });
/** Owner only. */
export const sendBackContentReview = (productId: string) => mutate(SEND_BACK, { productId });

export const refreshProductContent = async (productId: string) =>
  (await mutate<{ refreshProductContent: { status: number; message: string } }>(REFRESH, { productId }))
    .refreshProductContent;

export const getContentReviewCounts = async () =>
  (await query<{ contentReviewCounts: ContentReviewCountsT }>(COUNTS)).contentReviewCounts;

/** `fields` is the full new list for that entity (replaces the stored list). */
export const setAlwaysReviewFields = (entityName: string, entityId: string, fields: string[]) =>
  mutate(ALWAYS_REVIEW, { entityName, entityId, fields });

export const resolveSupplierUpdateChecked = (
  id: string,
  action: SupplierUpdateAction,
  mergedValue: unknown,
  expectedSupplierValue: unknown
) => mutate(RESOLVE_SUPPLIER_UPDATE_REVIEW, { id, action, mergedValue, expectedSupplierValue });

/** Owner only. */
export const getAuditArchives = async () => (await query<{ auditArchives: AuditArchiveT[] }>(ARCHIVES)).auditArchives;
/** Owner only. Pre-signed link, valid 5 minutes. */
export const getAuditArchiveDownloadUrl = async (month: string, kind: ArchiveKind) =>
  (await query<{ auditArchiveDownloadUrl: string }>(ARCHIVE_URL, { month, kind })).auditArchiveDownloadUrl;

/** Error code from an Apollo/GraphQL error, or "" (message is "CODE: text"). */
export const errorCode = (err: any): string => {
  const c = err?.errors?.[0]?.code ?? err?.graphQLErrors?.[0]?.extensions?.code ?? err?.extensions?.code;
  if (c) return String(c);
  const m = String(err?.errors?.[0]?.message ?? err?.message ?? "");
  return /^([A-Z_]+):/.exec(m)?.[1] ?? "";
};
