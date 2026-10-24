import HotelBookingConfirmation from "@/pages/web/hotel/checkout/HotelBookingConfirmation";

// Hotel booking detail from My Bookings — the same voucher page as the post-checkout
// confirmation, just navigating back to the bookings list instead of hotel search.
const HotelBookingDetail = () => (
  <HotelBookingConfirmation backRoute="/bookings" backTitle="Back to Bookings" />
);

export default HotelBookingDetail;
