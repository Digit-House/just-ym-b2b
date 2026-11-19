export type SupplierUpdateAction = "KEEP_MINE" | "USE_SUPPLIER" | "MERGE";

export type ContentListItemT = {
  id: string;
  name: string;
  image: string;
  city: string;
  category: string;
  isPublished: boolean | null;
  pendingSupplierUpdates: number;
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
  editedFields: string[];
  pendingSupplierUpdates: number;
};

export type ContentOptionT = {
  id: string;
  name: string;
  deletedAt?: string | null;
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
  status: "PENDING" | "KEPT" | "APPLIED" | "MERGED";
  createdAt: string;
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
