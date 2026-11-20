import { warpGql } from "@/util";
import client from "./client";
import { SEND_BROADCAST_NOTIFICATION } from "./type-query/pushNotification";

export type BroadcastNotificationInput = {
  title: string;
  body: string;
  screen?: string;
  productId?: string;
  hotelId?: string;
  url?: string;
  userIds?: string[];
};

export const sendBroadcastNotification = async (
  input: BroadcastNotificationInput
) => {
  return client.mutate<{
    sendBroadcastNotification: { queued: boolean; targetCount: number };
  }>({
    mutation: warpGql(SEND_BROADCAST_NOTIFICATION),
    variables: { input },
    fetchPolicy: "no-cache",
  });
};
