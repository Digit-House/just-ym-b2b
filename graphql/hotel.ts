import { addDays, format } from "date-fns";
import { warpGql } from "@/util";
import client from "./client";
import {
  BOOKING_ITINERARY_QUERY,
  CREATE_HOTEL_RESERVATION_MUTATION,
  HOTEL_INFO_QUERY,
  HOTEL_MULTICOMPLETE_QUERY,
  HOTEL_ROOMS_QUERY,
  HOTEL_SEARCH_BY_REGION_QUERY,
  UPDATE_HOTEL_MUTATION,
} from "./type-query/hotel";
import {
  CreateEtgHotelReservationInputT,
  CreateEtgHotelReservationOutputT,
  EtgCustomerBookingItineraryOutputT,
  HotelGuestInput,
  HotelInfoT,
  HotelMulticompleteResultT,
  HotelRoomTypeT,
  HotelSearchByRegionResultT,
  HotelSearchRegionInput,
} from "@/types/hotel.type";

// Seed value only — the actual residency used in requests always comes from HotelSearchState,
// set via the nationality picker in HotelSearchBar.
export const DEFAULT_HOTEL_RESIDENCY = "th";
export const DEFAULT_HOTEL_RESIDENCY_LABEL = "Thailand";

// ETG/worldota CDN URLs come back as templates, e.g. https://cdn.worldota.net/t/{size}/content/...jpeg
// The `{size}` token must be replaced with a concrete WxH before the URL is usable as an <img src>.
export const resolveHotelImageUrl = (
  url: string | null | undefined,
  size: string = "1024x768"
): string => (url ? url.replace("{size}", size) : "");

// Some ETG content entries resolve to a storage-cache host that reliably 404s/serves broken images.
const BROKEN_HOTEL_IMAGE_HOST_FRAGMENT = "storage-cache.p";

export const filterValidHotelImages = (
  images: string[] | null | undefined
): string[] =>
  (images ?? []).filter(
    (url) => !!url && !url.includes(BROKEN_HOTEL_IMAGE_HOST_FRAGMENT)
  );

// An empty <img src> never fires onError in most browsers, so callers must fall back to
// this directly rather than relying on ImageFallback's onError alone. Mirrors ImageFallback's
// own default — public/placeholder-image.jpg exists but is a 0-byte stub, so it can't be used.
export const HOTEL_IMAGE_PLACEHOLDER =
  "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";

export const getHotelPhotoSrc = (
  images: string[] | null | undefined,
  size: string = "1024x768"
): string =>
  resolveHotelImageUrl(filterValidHotelImages(images)[0], size) ||
  HOTEL_IMAGE_PLACEHOLDER;

export const searchHotelsByRegion = async (
  input: HotelSearchRegionInput
): Promise<HotelSearchByRegionResultT> => {
  const res: any = await client.query({
    query: warpGql(HOTEL_SEARCH_BY_REGION_QUERY),
    variables: { input },
    fetchPolicy: "no-cache",
  });
  return res.data.hotelSearchByRegion;
};

export const fetchHotelsByRegion = async ({
  pageParam = 1,
  queryKey,
}: any): Promise<HotelSearchByRegionResultT> => {
  const [
    ,
    {
      regionId,
      checkin,
      checkout,
      guests,
      residency,
      starRating,
      mealType,
      freeCancellationOnly,
      priceFrom,
      priceTo,
      sort,
    },
  ] = queryKey;

  if (!regionId) {
    return { hotels: [], total_hotels: 0, page: pageParam, limit: 0 };
  }

  const filter: HotelSearchRegionInput["filter"] = {};
  if (starRating.length) filter.star_rating = starRating.map(Number);
  if (mealType.length) filter.meal_type = mealType;
  if (freeCancellationOnly) filter.free_cancellation = true;
  if (priceFrom) filter.price_from = priceFrom;
  if (priceTo) filter.price_to = priceTo;

  const input: HotelSearchRegionInput = {
    region_id: regionId,
    checkin,
    checkout,
    guests,
    residency,
    page: pageParam,
    limit: 8,
    sort_by: sort,
    filter: Object.keys(filter).length ? filter : undefined,
  };

  const res = await searchHotelsByRegion(input);
  const fetchedSoFar = (pageParam - 1) * res.limit + res.hotels.length;

  return {
    ...res,
    nextPage: res.hotels.length && fetchedSoFar < res.total_hotels ? pageParam + 1 : undefined,
  };
};

export const searchHotelDestinations = async (
  query: string
): Promise<HotelMulticompleteResultT> => {
  const res: any = await client.query({
    query: warpGql(HOTEL_MULTICOMPLETE_QUERY),
    variables: { input: { query } },
    fetchPolicy: "no-cache",
  });
  return res.data.hotelMulticomplete;
};

// Hotel info (name, gallery, address, description) doesn't depend on search dates, so it's
// fetched once with fixed placeholder dates — separately from room rates — so the header and
// gallery can render immediately and stay put while the user adjusts dates/guests and
// re-searches rooms.
export const getHotelInfo = async (id: string): Promise<HotelInfoT | null> => {
  const checkin = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const checkout = format(addDays(new Date(), 2), "yyyy-MM-dd");

  const res: any = await client.query({
    query: warpGql(HOTEL_INFO_QUERY),
    variables: {
      input: {
        id,
        checkin,
        checkout,
        guests: [{ adults: 1, children: [] }],
        residency: DEFAULT_HOTEL_RESIDENCY,
      },
    },
    fetchPolicy: "no-cache",
  });
  return res.data.hotelpageV2.hotel_info;
};

export const getHotelRooms = async (params: {
  id: string;
  checkin: string;
  checkout: string;
  guests: HotelGuestInput[];
  residency: string;
}): Promise<HotelRoomTypeT[]> => {
  const res: any = await client.query({
    query: warpGql(HOTEL_ROOMS_QUERY),
    variables: {
      input: {
        id: params.id,
        checkin: params.checkin,
        checkout: params.checkout,
        guests: params.guests,
        residency: params.residency,
      },
    },
    fetchPolicy: "no-cache",
  });
  return res.data.hotelpageV2.hotel?.room_types ?? [];
};

export const createHotelReservation = async (
  input: CreateEtgHotelReservationInputT
): Promise<CreateEtgHotelReservationOutputT> => {
  const res: any = await client.mutate({
    mutation: warpGql(CREATE_HOTEL_RESERVATION_MUTATION),
    variables: { input },
  });
  return res.data.createHotelReservation;
};

export const updateHotel = async (data: {
  id: string;
  isRecommended?: boolean;
}): Promise<{ message: string; status: number }> => {
  const res: any = await client.mutate({
    mutation: warpGql(UPDATE_HOTEL_MUTATION),
    variables: { data },
  });
  return res.data.updateHotel;
};

// Voucher PDFs live on the public assets CDN; the API returns only the object path.
const HOTEL_VOUCHER_BASE_URL = "https://assets.justym.me";

export const resolveHotelVoucherUrl = (url: string): string =>
  url.startsWith("http") ? url : `${HOTEL_VOUCHER_BASE_URL}/${url}`;

// Full reservation itinerary by id — the voucher PDF is generated asynchronously, so
// callers poll while voucherStatus is GENERATING.
export const getBookingItinerary = async (
  id: string
): Promise<EtgCustomerBookingItineraryOutputT> => {
  const res: any = await client.query({
    query: warpGql(BOOKING_ITINERARY_QUERY),
    variables: { id },
    fetchPolicy: "no-cache",
  });
  return res.data.bookingItinerary;
};
