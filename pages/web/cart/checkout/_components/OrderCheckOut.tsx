import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useWalletStore } from "@/store/useWalletStore";
import React, { useState } from "react";
import Model from "./Model";
import { toast } from "sonner";
import { BOOKING_CREATE_MUTATION_DATA_TYPE } from "@/graphql/type-query/booking";
import { ADD_TO_CART_ITEM_DATA_TYPE } from "@/types/product.type";
import { createBookingWithCart } from "@/graphql/booking";
import { useNavigate } from "react-router-dom";
import { getAddToCartCount } from "@/graphql/product";
import { getErrMsg } from "@/util/initData";
import { useUser } from "@/provider/UserProvider";

const OrderCheckOut = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { selectedCartList, userInfo, setAddToCartCount, setSelectedCartList } =
    useCartStore();
  const { creditInfo, setCreditInfo } = useWalletStore();
  const { user } = useUser();
  const navigate = useNavigate();

  const total = selectedCartList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!selectedCartList || selectedCartList.length === 0) {
      toast.error("something went wrong");
      return;
    }
    setLoading(true);
    try {
      const data: BOOKING_CREATE_MUTATION_DATA_TYPE = {
        cartItemIds: selectedCartList.map(
          (item: ADD_TO_CART_ITEM_DATA_TYPE) => item.id
        ),
        customerName: userInfo?.leaderName || "Guest",
        email: userInfo?.leaderEmail || "",
        mobileNumber: userInfo?.leaderPhone || null,
        mobilePrefix: null,
        partnerReference: null,
        passportNumber: null,
        promoCodeId: null,
        promotionType: null,
        remarks: null,
        returnUri: `${window.location.origin}/bookings`,
      };

      const res: any = await createBookingWithCart(data);
      if (res.data) {
        setSelectedCartList([]);
        fetchAddToCartCount();
        if (user.type !== "OWNER") {
          setCreditInfo({
            ...creditInfo,
            balance: creditInfo.balance - total,
          });
        }
        navigate(
          `/cart/preview/${res.data.createBookingWithCart.transactionId}`
        );
        toast.success("Booking created successfully");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchAddToCartCount = async () => {
    try {
      const res: any = await getAddToCartCount();
      if (res.data) {
        setAddToCartCount(res.data.myCart.itemsCount);
      }
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    }
  };

  return (
    <div className="w-full">
      <Button
        disabled={loading}
        className="w-full"
        size="lg"
        onClick={() => {
          if (total > creditInfo.balance) {
            setOpen(true);
          } else {
            handleCheckout();
          }
        }}
      >
        {loading ? "Loading..." : "Checkout"}
      </Button>
      <Model open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default OrderCheckOut;
