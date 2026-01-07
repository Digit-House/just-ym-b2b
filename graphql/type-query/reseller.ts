export const GET_ALL_RESELLERS = `
query FindAllResellers($params: AbstractPagedParams!) {
  findAllResellers(params: $params) {
    total
    data {
      active
      createdAt
      credit {
        balance
        currency
        id
        totalUsage
        updatedAt
        totalTopUp
        otherBalance
        lastMonthUsage
        hasOutstandingDebt
        createdAt
      }
      id
      name
      updatedAt
    }
  }
}
`;