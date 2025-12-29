export const GET_ALL_PRODUCTS = `
query FindAllProducts($params: UserProductsInput!) {
  findAllProducts(params: $params) {
    total
    data {
      category
      city
      description
      dhSellingPrice
      id
      image
      isCancellable
      media {
        extension
        name
        path
        size
        type
      }
      name
      originalPrice
      price
    }
  }
}
`;
