import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyBookingList } from "@/graphql/booking";
import { BOOKING_STATUS_ENUM } from "@/types/booking.type";

const EVENT = "manual-confirm-changed";

/** Call after a booking is confirmed or a voucher is saved so the sidebar count refreshes at once. */
export const notifyManualConfirmChanged = () => window.dispatchEvent(new Event(EVENT));

/** Bookings waiting for owner confirmation (total of a limit-1 list). Polls every 60 s; 0 when disabled or on error. */
export const useManualConfirmCount = (enabled: boolean) => {
  const { data, refetch } = useQuery({
    queryKey: ["manualConfirmCount"],
    queryFn: () =>
      getMyBookingList({
        page: 1,
        limit: 1,
        orderBy: { dir: "desc", field: "transactedTime" },
        status: BOOKING_STATUS_ENUM.PAID,
        search: null,
        requireManualConfirm: true,
      }),
    enabled,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
  useEffect(() => {
    if (!enabled) return;
    const on = () => void refetch();
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, [enabled, refetch]);
  return enabled ? data?.total ?? 0 : 0;
};
