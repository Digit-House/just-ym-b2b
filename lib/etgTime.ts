const UTC_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/**
 * ETG cancellation deadlines are UTC ("...Z"); show them in UTC with the zone
 * spelled out, never converted to the viewer's time zone.
 */
export const formatEtgUtc = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${UTC_FORMAT.format(date)} (UTC+0)`;
};
