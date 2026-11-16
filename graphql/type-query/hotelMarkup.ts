export const GET_HOTEL_MARKUP_SETTING = `
query HotelMarkupSetting {
  hotelMarkupSetting {
    percent
    floorThb
    updatedAt
  }
}
`;

export const UPDATE_HOTEL_MARKUP_SETTING = `
mutation UpdateHotelMarkupSetting($input: UpdateHotelMarkupSettingInput!) {
  updateHotelMarkupSetting(input: $input) {
    percent
    floorThb
    updatedAt
  }
}
`;
