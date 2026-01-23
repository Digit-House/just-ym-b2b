export const GET_CREDIT_INFO = `
query GetCreditInfo {
  getCreditInfo {
    balance
    currency
    hasOutstandingDebt
    id
    gtBalance
    gtBalanceMain
    customerBalance
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
      paymentMethod {
        id
        name
        bankName
        accountNumber
        accountName
        currency
      }
        createdBy {
        id
        email
        contactNo
        active
        username
      }
      reseller {
        id
        active
        email
        name
      } 
         confirmBy {
        id
        email
        contactNo
        active
        username
      } 
    }
  }
}`;

export const ADMIN_TOPUP= `
mutation TopUpGTBalance($data: TopupGTInput!) {
  topUpGTBalance(data: $data) {
    message
    status
  }
}
`;

export const TOPUP_HISTORY = `
query FindAllTopUpHistory($data: TopUpPagedParams!) {
  findAllTopUpHistory(data: $data) {
    total
    data {
      id
      relatedImages
      reseller {
        active
        id
        name
      }
      currencyRate {
        createdAt
        updatedAt
        mmk
        id
      }
      status
      resellerId
      topUpBalance
      updatedAt
      currency
      createdAt
      confirmBy {
        id
        email
        contactNo
        username
      }
      createdBy {
        id
        email
        contactNo
        username
      }
      paymentMethod {
        id
        name
        bankName
        accountNumber
        accountName
        currency
      }
    }
  }
}`;

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

export const CONFIRM_TOPUP = `
mutation ConfirmTopUp($data: ConfirmTopUpInput!) {
  confirmTopUp(data: $data) {
    message
    status
  }
}
`;
