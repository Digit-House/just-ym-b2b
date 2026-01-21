export const GET_ALL_RESELLERS = `
query FindAllResellers($params: ResellerFindAllParam!) {
  findAllResellers(params: $params) {
    total
    data {
      active
      contactNo
      createdAt
      credit {
        balance
        currency
        totalTopUp
        totalUsage
        id
        createdAt
        updatedAt
        lastMonthUsage
        hasOutstandingDebt
      }
      name
      id
      email
      username
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
