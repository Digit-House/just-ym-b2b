import { QusetionT } from "@/types/product.type";

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
      isPublished
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

export const UPDATE_PRODUCT_POSITION = `
mutation UpdateProductPosition($data: UpdateProductPositionInput!) {
  updateProductPosition(data: $data) {
    status
    message
  }
}
`;

export const GET_PRODUCT_INFO = `
query GetProductInfo($productId: String!,$includeRelated: Boolean) {
  getProductInfo(productId: $productId,includeRelated: $includeRelated) {
    id
    name
    addressLine
    category
    category_relation{
    id
    name
    }
    city
    cityId
    city_relation_id
    countryId
    createdAt
    description
    description_mm
    exclusions
    exclusions_mm
    highlights
    highlights_mm
    howToUseList
    howToUseList_mm
    image
    inclusions
    inclusions_mm
    isBestSeller
    isCancellable
    isGTRecommend
    isRecommended
    isPublished
    isInstantConfirmation
    requiresManualConfirmation
    isOpenDated
    keywords
    latitude
    location
    longitude
    relatedProducts {
      category
      city
      description
      dhSellingPrice
      id
      image
      isCancellable
      isPublished
      name
      originalPrice
      price
      requiresManualConfirmation
    }
    media {
      extension
      isPublished  
      name
      path
      size
      type
    }
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
    thingsToNote_mm 
    thingsToNote
    timezoneOffset
    updatedAt
    whatToExpect
    whatToExpect_mm
    productOptions {
     id
     name
     description
     isPublished
     visitDate{
      isOpenDated
     }
     ticketValidity
     thaiNationalOnly
     redeemStart
     redeemEnd
     definedDuration 
     inclusions
     inclusions_mm
     ticketType {
        id
        name
        dhNetPrice
        minimumSellingPrice
        recommendedSellingPrice
        dhSellingPrice
        maxPurchaseQty
        minPurchaseQty
        nettPrice
        ageFrom
        ageTo
        originalPrice
        globaltixId
        createdAt
        updatedAt
      }
    }
  }
}
`;

export const GET_PRODUCT_OPTIONS = `
query Query($productId: String!, $date: String) {
  getProductInfo(productId: $productId, date: $date) {
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
        dhNetPrice
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

export interface TICKET_TYPE_EVENT_AVAILABLE_DATA_TYPE {
  dateFrom: string;
  dateTo: string;
  globalTixTicketTypeID: number;
}

export interface GUEST_USER_INFO_TYPE {
  customerName: string;
  email: string;
  mobileNumber: string | null;
}

export interface ADD_TO_CART_DATA_TYPE {
  cartItemId: string | null;
  eventId: string | null;
  eventTime: string | null;
  quantity: number;
  questionList: [QusetionT][];
  ticketTypeId: string | null;
  visitDate: string | null;
  guestInfoSameAsUserInfo: boolean;
  guestUserInfo: GUEST_USER_INFO_TYPE;
  guestInfo: GUEST_USER_INFO_TYPE | null;
}

export const GET_TICKET_TYPE_EVENT_AVAILABLE = `
query CheckEventAvailability($data: TicketTypeEventAvailableInput!) {
  checkEventAvailability(data: $data) {
    available
    enableEmp
    id
    isAdHoc
    isInactive
    seriesId
    seriesName
    time
    total
    unlimited
    used
  }
}`;

export const GET_ADD_TO_CART_QUERY = `
query Query {
  myCart {
    id
    items {
      currency
      eventId
      eventTime
      globaltixTicketTypeId
      id
      image
      price
      productId
      productName
      productOptionId
      productOptionName
      quantity
      questionIds
      ticketTypeId
      ticketTypeName
      visitDate
      questionList
    }
  }
}
`;

export const ADD_TO_CART_MUTATION = `mutation Mutation($item: CartItemInput!) {
  addToCart(item: $item) {
    itemsCount
    success
    cartItemId
  }
}`;

export const GET_ADD_TO_CART_COUNT_QUERY = `
query Query {
  myCart {
    itemsCount
  }
}`;

export const RESEND_EMAIL_MUTATION = `
mutation Mutation($data: ResendBookingEmailInput!) {
  resendBookingEmail(data: $data) {
    message
    status
  }
}`;

export const ALL_CLEAR_CART_MUTATION = `
mutation ClearCart {
  clearCart {
    itemsCount
    success
  }
}`;

export const CLEAR_CART_MUTATION = `
mutation RemoveFromCart($cartItemId: String!) {
  removeFromCart(cartItemId: $cartItemId) {
    itemsCount
    success
  }
}
`;

export const UPDATE_PRODUCT_MUTATION = `mutation UpdateProduct($data: ProductUpdateInput!) {
  updateProduct(data: $data) {
    message
    status
  }
}
`;

export const SEED_PRODUCT_MUTATION = `
mutation Mutation($productId: String!) {
  seedProduct(productId: $productId) {
    message
    status
  }
}`;

export type ExportProductReportT = {
  isPublished:boolean;
}

export interface ProductReportInput {
  isPublished?: boolean;
}

export const EXPORT_PRODUCTS_REPORT = `
query ExportProductsReport($data: ProductReportInput!) {
  exportProductsReport(data: $data) {
    contentType
    data
    extension
    filename
  }
}
`;