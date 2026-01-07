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

export const CREATE_CATEGORY = `
mutation CreateCategory($data: CategoryCreateInputDTO!) {
  createCategory(data: $data) {
    createdAt
    id
    name
    updatedAt
  }
}
`;

export const GET_ALL_CITIES = `
query Cities($params: CityPagedParams!) {
  cities(params: $params) {
    total
    data {
      countryId
      createdAt
      id
      isCapital
      isPublished
      name
      timezoneOffset
      updatedAt
    }
  }
}
`;

export const UPDATE_CITY = `
mutation UpdateCity($updateCityId: String!, $input: CityUpdateInput!) {
  updateCity(id: $updateCityId, input: $input) {
    message
    status
  }
}
`;

export const GET_ALL_COUNTRIES = `
query Countries($params: CountryPagedParams!) {
  countries(params: $params) {
    total
    data {
      code
      createdAt
      currency {
        code
        creditCardFee
        description
        markup
        roundingUp
      }
      id
      isBilling
      isCurrencyExchange
      isDistributionTable
      isListing
      isPublished
      lastUpdated
      mobilePrefix
      name
      updatedAt
    }
  }
}
`;

export const UPDATE_COUNTRY = `
mutation UpdateCountry($updateCountryId: String!, $input: CountryUpdateInput!) {
  updateCountry(id: $updateCountryId, input: $input) {
    status
    message
  }
}
`;
