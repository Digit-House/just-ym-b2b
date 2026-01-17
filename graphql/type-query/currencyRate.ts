export const GET_CURRENCY_RATE = `
query CurrencyRate {
  currencyRate {
    createdAt
    id
    mmk
    updatedAt
  }
}
`;

export const UPDATE_CURRENCY_RATE = `
mutation UpdateCurrencyRate($input: CurrencyRateCreateManyInput!) {
  updateCurrencyRate(input: $input) {
    id
    mmk
    updatedAt
    createdAt
  }
}
`;