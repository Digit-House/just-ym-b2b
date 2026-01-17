export const GET_PAYMENT_METHODS = `
query PaymentMethods($activeOnly: Boolean) {
  paymentMethods(activeOnly: $activeOnly) {
    accountName
    accountNumber
    bankName
    id
    instructions
    currency
    isActive
    logo
    name
    qrCodeUrl
    type
    createdAt
    updatedAt
  }
}
`;

export const CREATE_PAYMENT_METHOD = `
mutation CreatePaymentMethod($input: PaymentMethodCreateInput!) {
  createPaymentMethod(input: $input) {
    id
  }
}
`;

export const UPDATE_PAYMENT_METHOD = `
mutation UpdatePaymentMethod($input: PaymentMethodUpdateInput!) {
  updatePaymentMethod(input: $input) {
    id
  }
}
`;

export const DELETE_PAYMENT_METHOD = `
mutation RemovePaymentMethod($removePaymentMethodId: String!) {
  removePaymentMethod(id: $removePaymentMethodId) {
    message
    status
  }
}
`;