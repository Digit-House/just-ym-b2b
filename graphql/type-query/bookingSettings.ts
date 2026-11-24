export const GET_BOOKING_SETTINGS = `
query BookingSettings {
  bookingSettings {
    blockMixedManualCart
  }
}
`;

export const UPDATE_BOOKING_SETTINGS = `
mutation UpdateBookingSettings($data: UpdateBookingSettingsInput!) {
  updateBookingSettings(data: $data) {
    blockMixedManualCart
  }
}
`;
