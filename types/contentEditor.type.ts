export type SupplierUpdateAction = "KEEP_MINE" | "USE_SUPPLIER" | "MERGE";

export type ContentReviewStatus = "IN_PROGRESS" | "SENT_BACK" | "READY_FOR_REVIEW" | "DONE";

export type ContentReviewCountsT = { readyForReview: number; sentBack: number };

/** Per-entity review metadata. supplierBaseline is keyed by content field name. */
export type ReviewMetaT = {
  editedFields: string[];
  alwaysReviewFields: string[];
  supplierBaseline?: Record<string, unknown> | null;
};

export type AuditArchiveT = {
  id: string;
  month: string;
  keys: string[];
  auditCount: number;
  supplierUpdateCount: number;
  createdAt: string;
};

export type ArchiveKind = "audit-logs" | "supplier-updates";

export type ContentListItemT = {
  id: string;
  name: string;
  image: string;
  city: string;
  category: string;
  isPublished: boolean | null;
  pendingSupplierUpdates: number;
  contentReviewStatus?: ContentReviewStatus | null;
};

export type ContentMediaT = {
  extension: string;
  name: string;
  path: string;
  size: number;
  type: string;
};

export type ContentTicketTypeT = {
  id: string;
  name: string;
  ageFrom?: number | null;
  ageTo?: number | null;
  minPurchaseQty?: number | null;
  maxPurchaseQty?: number | null;
  deletedAt?: string | null;
  supplierOriginalPrice?: number | null;
  customOriginalPrice?: number | null;
  editedFields: string[];
  alwaysReviewFields: string[];
  supplierBaseline?: Record<string, unknown> | null;
  pendingSupplierUpdates: number;
};

export type ContentOptionT = {
  id: string;
  name: string;
  deletedAt?: string | null;
  editedFields: string[];
  alwaysReviewFields: string[];
  supplierBaseline?: Record<string, unknown> | null;
  ticketTypes: ContentTicketTypeT[];
  pendingSupplierUpdates: number;
  [key: string]: any;
};

export type ProductContentT = {
  id: string;
  name: string;
  media: ContentMediaT[];
  productOptions: ContentOptionT[];
  pendingSupplierUpdates: number;
  editedFields: string[];
  alwaysReviewFields: string[];
  supplierBaseline?: Record<string, unknown> | null;
  contentReviewStatus?: ContentReviewStatus | null;
  contentReviewSubmittedAt?: string | null;
  contentReviewSentBackAt?: string | null;
  [key: string]: any;
};

export type SupplierUpdateT = {
  id: string;
  entityName: "Product" | "ProductOption" | "TicketType" | string;
  entityId: string;
  productId: string;
  field: string;
  baselineValue: unknown;
  supplierValue: unknown;
  status: "PENDING" | "KEPT" | "APPLIED" | "MERGED" | "OBSOLETE";
  createdAt: string;
  /** "<ticket> › Option: <name> › Ticket type: <name>"; deleted items end with "(deleted)". */
  location?: string | null;
  locationIds?: { productId?: string; optionId?: string; ticketTypeId?: string } | null;
};

export type AuditLogT = {
  id: string;
  action: string;
  entityName: string;
  entityId?: string | null;
  productId?: string | null;
  source?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  user?: { id: string; name?: string | null; email?: string | null } | null;
  createdAt: string;
  location?: string | null;
  locationIds?: { productId?: string; optionId?: string; ticketTypeId?: string } | null;
};

export type AuditFilterT = {
  productId?: string;
  entityName?: string;
  userId?: string;
  action?: string;
  source?: string;
  from?: string;
  to?: string;
};
