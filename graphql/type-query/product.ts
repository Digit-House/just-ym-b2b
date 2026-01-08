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
`;

export const GET_PRODUCT_OPTIONS = `
query Query($userProductId: String!, $date: DateTime) {
  user_product(id: $userProductId, date: $date) {
    productOptions {
      advanceBooking {
        day
        dayMinute
        hour
        minute
        required
      }
      availability
      createdAt
      currency
      definedDuration
      demandType
      description
      id
      inclusions
      isDynamicPricing
      isTagged
      keywords
      name
      primaryTicket
      productId
      publishStart
      questionIds
      isCapacity
      redeemEnd
      redeemStart
      ticketFormat
      ticketType {
        ageFrom
        ageTo
        applyToAllQna
        createdAt
        dhSellingPrice
        id
        issuanceLimit
        maxPurchaseQty
        minPurchaseQty
        name
        originalPrice
        similarTicketId
        sku
        updatedAt
        useBin
        globaltixId
      }
      ticketValidity
      timeSlot
      tourInformation
      type
      updatedAt
      visitDate {
        isOpenDated
        request
        required
      }
      publishEnd
      questions {
        cartItemId
        createdAt
        globaltixId
        id
        isAnswerLater
        optionCode
        optionList {
          key
          value
        }
        optional
        options
        question
        questionCode
        type
        updatedAt
      }
    }
  }
}`;
