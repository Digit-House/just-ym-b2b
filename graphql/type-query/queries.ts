export const GET_ALL_CATEGORIES = `
  query FindAllCategories($params: AbstractPagedParams!) {
    findAllCategories(params: $params) {
      data {
        createdAt
        id
        name
        updatedAt
      }
      total
    }
  }
`;

export const GET_ALL_COUNTRIES = `
query Countries {
  countries {
    createdAt
    id
    name
    updatedAt
    code
  }
}
`;
