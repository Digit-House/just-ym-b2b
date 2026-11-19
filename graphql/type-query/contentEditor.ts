const AUDIT_FIELDS = `
  id
  action
  entityName
  entityId
  productId
  source
  oldValues
  newValues
  user { id name email }
  createdAt
`;

const SUPPLIER_UPDATE_FIELDS = `
  id
  entityName
  entityId
  productId
  field
  baselineValue
  supplierValue
  status
  createdAt
`;

export const CONTENT_PRODUCTS = `
query ContentProducts($filter: ContentProductsFilterInput, $page: PageInput) {
  contentProducts(filter: $filter, page: $page) {
    total
    data {
      id
      name
      image
      city
      category
      isPublished
      pendingSupplierUpdates
    }
  }
}
`;

export const PRODUCT_CONTENT = `
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
    editedFields pendingSupplierUpdates
    productOptions {
      id name description description_mm termsAndConditions termsAndConditions_mm image
      howToUse howToUse_mm inclusions inclusions_mm exclusions exclusions_mm
      tourInformation cancellationNotes
      isPublished isCancellable ticketValidity timeSlot sortOrder deletedAt
      editedFields pendingSupplierUpdates
      ticketTypes { id name ageFrom ageTo minPurchaseQty maxPurchaseQty deletedAt editedFields pendingSupplierUpdates }
    }
  }
}
`;

export const UPDATE_PRODUCT_CONTENT = `
mutation UpdateProductContent($input: UpdateProductContentInput!) {
  updateProductContent(input: $input) { id }
}
`;

export const SUPPLIER_UPDATES = `
query SupplierUpdates($productId: ID!, $status: SupplierUpdateStatus) {
  supplierUpdates(productId: $productId, status: $status) { ${SUPPLIER_UPDATE_FIELDS} }
}
`;

export const RESOLVE_SUPPLIER_UPDATE = `
mutation ResolveSupplierUpdate($id: ID!, $action: SupplierUpdateAction!, $mergedValue: JSON) {
  resolveSupplierUpdate(id: $id, action: $action, mergedValue: $mergedValue) { id status }
}
`;

export const AUDIT_LOGS = `
query AuditLogs($filter: AuditLogFilterInput, $page: PageInput) {
  auditLogs(filter: $filter, page: $page) {
    total
    items { ${AUDIT_FIELDS} }
  }
}
`;
