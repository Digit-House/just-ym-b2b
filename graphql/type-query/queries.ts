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

export const GET_ALL_CITIES = `
query Cities($countryId: String!) {
  cities(countryId: $countryId) {
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
`

export const GET_ALL_COUNTRIES = `
query Countries {
  countries {
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
    isPublished
    lastUpdated
    mobilePrefix
    name
    updatedAt
  }
}
`;
