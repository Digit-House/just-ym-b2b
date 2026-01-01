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


export const GET_PRODUCT_INFO = `
query GetProductInfo($productId: String!) {
  getProductInfo(productId: $productId) {
    addressLine
    blockedDate {
      date
      title
    }
    category
    city
    cityId
    city_relation_id
    countryId
    createdAt
    description
    exclusions
    highlights
    howToUseList
    id
    image
    inclusions
    isBestSeller
    isCancellable
    isGTRecommend
    isInstantConfirmation
    isOpenDated
    keywords
    latitude
    location
    longitude
    media {
      extension
      name
      path
      size
      type
    }
    name
    operatingHours {
      custom
      fixedDays {
        day
        endHour
        startHour
      }
      isToursActivities
    }
    originalPrice
    postalCode
    termsAndConditions
    thingsToNote
    timezoneOffset
    updatedAt
    whatToExpect
    productOptions {
      ticketType {
        ageFrom
        ageTo
        applyToAllQna
        createdAt
        dhNetPrice
        dhRecommendedSellingPrice
        dhSellingPrice
        globaltixId
        id
        issuanceLimit
        maxPurchaseQty
        minPurchaseQty
        name
        nettPrice
        originalPrice
        similarTicketId
        sku
        updatedAt
        useBin
      }
    }
  }
}
`