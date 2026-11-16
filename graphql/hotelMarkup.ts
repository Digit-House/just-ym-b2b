import { warpGql } from "@/util";
import client from "./client";
import {
  GET_HOTEL_MARKUP_SETTING,
  UPDATE_HOTEL_MARKUP_SETTING,
} from "./type-query/hotelMarkup";

export type HotelMarkupSettingT = {
  percent: number;
  floorThb: number;
  updatedAt: string | null;
};

export const getHotelMarkupSetting = async () => {
  const res: any = await client.query({
    query: warpGql(GET_HOTEL_MARKUP_SETTING),
    fetchPolicy: "no-cache",
  });
  return res.data.hotelMarkupSetting as HotelMarkupSettingT;
};

export const updateHotelMarkupSetting = async (
  percent: number,
  floorThb: number,
) => {
  const res: any = await client.mutate({
    mutation: warpGql(UPDATE_HOTEL_MARKUP_SETTING),
    variables: { input: { percent, floorThb } },
    fetchPolicy: "no-cache",
  });
  return res.data.updateHotelMarkupSetting as HotelMarkupSettingT;
};
