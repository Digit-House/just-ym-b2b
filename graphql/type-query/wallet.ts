export const GET_CREDIT_INFO = `
query GetCreditInfo {
  getCreditInfo {
    balance
    currency
    hasOutstandingDebt
    id
    lastMonthUsage
    otherBalance
    totalTopUp
    totalUsage
  }
}
`;

export const TOP_UP_HISTORY = `
query FindAllTopUpHistory($data: TopUpPagedParams!) {
  findAllTopUpHistory(data: $data) {
    total
    data {
      createdAt
      currency
      id
      relatedImages
      resellerId
      status
      topUpBalance
      updatedAt
    }
  }
}
`;

export const ADD_TOP_UP = `
mutation TopUp($data: TopUpInput!) {
  topUp(data: $data) {
    createdAt
    currency
    id
    relatedImages
    reseller {
      active
      createdAt
      id
      name
      updatedAt
    }
    resellerId
    status
    topUpBalance
    updatedAt
  }
}
`;
