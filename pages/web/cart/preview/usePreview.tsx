import { getBookingDetail } from "@/graphql/booking";
import { MY_BOOKING_DATA_TYPE } from "@/types/booking.type";
import { useEffect, useState } from "react";

export const usePreview = (id?: string) => {
  const [bookingDetail, setBookingDetail] =
    useState<MY_BOOKING_DATA_TYPE | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);

  const fetchBookingDetail = async (id: string) => {
    setLoading(true);
    try {
      const res: any = await getBookingDetail(id);
      if (res.data) {
        const data = res.data.getTransactionDetailBy;
        const total = data.bookingTickets.reduce((sum: any, data: any) => {
          return sum + data.price * data.quantity;
        }, 0);
        setTotal(total);
        setBookingDetail(res.data.getTransactionDetailBy);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    } else {
      fetchBookingDetail(id);
    }
  }, [id]);

  return {
    bookingDetail,
    setBookingDetail,
    total,
    setTotal,
    loading,
    setLoading,
    resendLoading,
    setResendLoading,
  };
};
