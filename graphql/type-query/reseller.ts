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

export const CREATE_RESELLER = `
mutation CreateReseller($data: ResellerCreateInputDTO!) {
  createReseller(data: $data) {
    id
  }
}
`;

export const UPDATE_RESELLER = `
mutation UpdateReseller($id: String!, $data: ResellerUpdateInputDTO!) {
  updateReseller(id: $id, data: $data) {
    id
  }
}
`;
