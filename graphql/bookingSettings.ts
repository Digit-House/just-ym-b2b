import { warpGql } from "@/util";
import client from "./client";
import {
  GET_BOOKING_SETTINGS,
  UPDATE_BOOKING_SETTINGS,
} from "./type-query/bookingSettings";

export type BookingSettingsT = { blockMixedManualCart: boolean };

export const getBookingSettings = async () => {
  const res: any = await client.query({
    query: warpGql(GET_BOOKING_SETTINGS),
    fetchPolicy: "no-cache",
  });
  return res.data.bookingSettings as BookingSettingsT;
};

export const updateBookingSettings = async (blockMixedManualCart: boolean) => {
  const res: any = await client.mutate({
    mutation: warpGql(UPDATE_BOOKING_SETTINGS),
    variables: { data: { blockMixedManualCart } },
    fetchPolicy: "no-cache",
  });
  return res.data.updateBookingSettings as BookingSettingsT;
};
