
export const GET_ALL_PRODUCTS = `
query FindAllProducts($params: AbstractPagedParams!) {
  findAllProducts(params: $params) {
    total
    data {
      id
      name
      createdAt
      image
    }
  }
}
`