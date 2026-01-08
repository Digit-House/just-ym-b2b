export const CREATE_ROLE = `
mutation CreateRole($data: RoleCreateInputDTO!) {
  createRole(data: $data) {
    id
  }
}
`;

export const GET_ALL_ROLES = `
query FindAllRoles($params: RolePaginatedInput!) {
  findAllRoles(params: $params) {
    total
    data {
      createdAt
      description
      id
      name
      resellerId
      updatedAt
    }
  }
}
`