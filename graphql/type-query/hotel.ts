export const CREATE_HOTEL_RESERVATION_MUTATION = `
mutation CreateHotelReservation($input: CreateEtgHotelReservationInput!) {
  createHotelReservation(input: $input) {
    priceChanged
    reservation {
      id
      bookingStatus
      status
      checkin
      checkout
      currencyCode
      paymentAmount
      createdAt
      expiresAt
      hid
      hotelStaticId
      hotelThumbnail
      paymentDetail {
        status
        paymentStatus
        method
        amount
        referenceNumber
        qrdata
        mmqrdata
        stripeClientSecret
        stripeCSId
        brand
        last4
      }
    }
    updatedRates {
      room_name
      book_hash
    }
  }
}
`;

export const UPDATE_HOTEL_MUTATION = `
mutation UpdateHotel($data: EtgHotelUpdateInput!) {
  updateHotel(data: $data) {
    message
    status
  }
}
`;

export const BOOKING_ITINERARY_QUERY = `
query BookingItinerary($id: String!) {
  bookingItinerary(id: $id) {
    id
    bookingStatus
    status
    checkin
    checkout
    nights
    createdAt
    currencyCode
    paymentAmount
    hid
    hotelName
    hotelStaticId
    hotelThumbnail
    hotelConfirmationNumber
    partnerOrderId
    roomName
    rooms {
      adults
      children
      beddingName
      mealName
      hasBreakfast
      guests {
        firstName
        lastName
        isChild
      }
    }
    freeCancellationBefore
    isCancellable
    cancellationSchedule {
      customerPenaltyAmount
      penaltyCurrency
      startAt
      endAt
    }
    paymentDetail {
      status
      paymentStatus
      method
      amount
      referenceNumber
    }
    voucherStatus
    voucherUrl
  }
}
`;

export const HOTEL_SEARCH_BY_REGION_QUERY = `
query HotelSearchByRegion($input: EtgSearchRegionInput!) {
  hotelSearchByRegion(input: $input) {
    total_hotels
    page
    limit
    hotels {
      hid
      id
      name
      address
      star_rating
      images
      kind
      isRecommended
      region_meta {
        name
        country_name
        country_code
      }
      rates {
        room_name
        bedding
        meal_type
        has_breakfast
        free_cancellation_before
        show_amount
        show_amount_per_night
        show_currency_code
        room_amenities
      }
    }
  }
}
`;

export const HOTEL_MULTICOMPLETE_QUERY = `
query HotelMulticomplete($input: EtgMulticompleteInput!) {
  hotelMulticomplete(input: $input) {
    regions {
      id
      name
      type
      country_name
      country_code
    }
    hotels {
      id
      hid
      name
      address
      city_name
      country_name
      region_id
    }
  }
}
`;

// Hotel info (name, gallery, address, description) doesn't depend on the search dates, so it's
// fetched separately from room rates — this lets the header/gallery render immediately and stay
// put while "Check Availability" re-fetches only HOTEL_ROOMS_QUERY.
export const HOTEL_INFO_QUERY = `
query HotelInfo($input: EtgHotelpageInput!) {
  hotelpageV2(input: $input) {
    hotel_info {
      id
      hid
      name
      address
      star_rating
      images
      latitude
      longitude
      check_in_time
      check_out_time
      phone
      description_struct {
        title
        paragraphs
      }
      amenity_groups {
        group_name
        amenities
        non_free_amenities
      }
      region_meta {
        name
        country_name
        country_code
      }
    }
  }
}
`;

export const HOTEL_ROOMS_QUERY = `
query HotelRooms($input: EtgHotelpageInput!) {
  hotelpageV2(input: $input) {
    hotel {
      hid
      id
      room_types {
        key
        name
        images
        room_amenities
        rates {
          room_name
          book_hash
          amenities_data
          room_data_trans {
            main_name
            bedding_type
            main_room_type
          }
          meal_data {
            has_breakfast
            value
          }
          payment_types {
            type
            show_amount
            show_currency_code
            cancellation_penalties {
              free_cancellation_before
            }
          }
        }
      }
    }
  }
}
`;
