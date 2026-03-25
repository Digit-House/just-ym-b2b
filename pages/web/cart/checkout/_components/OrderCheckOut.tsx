import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useState } from "react";
import Model from "./Model";
import { toast } from "sonner";
import { BOOKING_CREATE_MUTATION_DATA_TYPE } from "@/graphql/type-query/booking";
import { ADD_TO_CART_ITEM_DATA_TYPE } from "@/types/product.type";
import { createBookingWithCart } from "@/graphql/booking";
import { useNavigate } from "react-router-dom";
import { getAddToCartCount } from "@/graphql/product";
import { getErrMsg } from "@/util/initData";
import { useUser } from "@/provider/UserProvider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const OrderCheckOut = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
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
    if (user.type === "OWNER" && user.twoFactorEnabled && code.length !== 6) {
      setCodeError("Please enter a valid 6-digit code");
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
        twoFactorCode:
          user.type === "OWNER" && user.twoFactorEnabled ? code : null,
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
      }else{
        toast.error("Failed to create booking");
      }
    } catch (err) {
      toast.error(getErrMsg(err,"message"));
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
    <div className="w-full space-y-6">
      {user.type === "OWNER" && user.twoFactorEnabled && (
        <div className="space-y-4">
          <p className="text-gray-500">
            Enter the 6-digit code from your authenticator app to complete
            setup.
          </p>

          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Authentication Code
            </Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setCode(value);
                if (value.length === 6) {
                  setCodeError("");
                }
              }}
              placeholder="Enter 6-digit code"
              className="text-center text-lg font-mono tracking-widest"
            />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {codeError && (
          <p className="text-red-500 text-sm font-medium">{codeError}</p>
        )}
        <Button
          disabled={loading}
          className="w-full"
          size="lg"
          onClick={() => {
            if (total > creditInfo.balance && user.type !== "OWNER") {
              setOpen(true);
            } else {
              handleCheckout();
            }
          }}
        >
          {loading ? "Loading..." : "Checkout"}
        </Button>
      </div>

      <Model open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default OrderCheckOut;
