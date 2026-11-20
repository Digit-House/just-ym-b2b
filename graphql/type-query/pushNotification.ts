export const SEND_BROADCAST_NOTIFICATION = `
mutation SendBroadcastNotification($input: SendBroadcastNotificationInput!) {
  sendBroadcastNotification(input: $input) {
    queued
    targetCount
  }
}
`;
