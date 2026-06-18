import { Button } from "@/components/ui/button";
import { addTocart, getAddToCart } from "@/graphql/product";
import { useCartStore } from "@/store/useCartStore";
import usePackageStore from "@/store/usePackageStore";
import { getErrMsg } from "@/util/initData";
import { StarsIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PackagePreViewCheckOut = () => {
  const { setAddToCartCount, userInfo, setSelectedCartList } = useCartStore();
  const { packageList } = usePackageStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckOut = async () => {
    setLoading(true);

    try {
      const responses = await Promise.all(
        packageList.map((data) => {
          const guestUserInfo = {
            customerName: userInfo.name,
            email: userInfo.email,
            mobileNumber: userInfo.phone || null,
          };

          const guestInfo = {
            customerName: userInfo.leaderName,
            email: userInfo.leaderEmail,
            mobileNumber: userInfo.leaderPhone || null,
          };

          const packageItems = data.packageItems
            .filter((item) => item.eventTime && item.eventTime.eventId !== "")
            .map((item) => item.eventTime);

          const visitDateSettings = data.packageItems
            .filter((item) => item.visitDateSettings)
            .map((item) => item.visitDateSettings);

          const packageFilter = data.packageItems
            .filter((item) => item.questions.length > 0)
            .map((item) => item.questionList);

          const maxLength = Math.max(...packageFilter.map((g) => g.length));

          const questionList = Array.from({ length: maxLength }, (_, i) =>
            packageFilter.map((group) => group[i]).flat()
          );

          const newData: any = {
            cartItemId: null,
            eventId: null,
            eventTime: null,
            guestInfoSameAsUserInfo: userInfo.sameAsLeader,
            guestUserInfo,
            guestInfo: userInfo.sameAsLeader ? guestUserInfo : guestInfo,
            packageItems,
            quantity: data.quantity,
            ticketTypeId: data.ticketTypeId,
            visitDate: null,
            visitDateSettings,
            questionList,
          };

          return addTocart(newData);
        })
      );

      //   ✅ SEE RESPONSE DATA HERE
      const cartItemIds: string[] = responses
        .map((res: any) => res.data?.addToCart?.cartItemId)
        .filter(Boolean);
      const lastResponse: any = responses[responses.length - 1];
      const itemsCount = lastResponse?.data?.addToCart?.itemsCount;
      toast.success("Added to cart successfully!");
      await fetchMyCart(cartItemIds);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Something went wrong!");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const responses = await Promise.all(
        packageList.map((data) => {
          const guestUserInfo = {
            customerName: userInfo.name,
            email: userInfo.email,
            mobileNumber: userInfo.phone || null,
          };

          const guestInfo = {
            customerName: userInfo.leaderName,
            email: userInfo.leaderEmail,
            mobileNumber: userInfo.leaderPhone || null,
          };
          const packageItems = data.packageItems
            .filter((item) => item.eventTime && item.eventTime.eventId !== "")
            .map((item) => item.eventTime);

          const visitDateSettings = data.packageItems
            .filter((item) => item.visitDateSettings)
            .map((item) => item.visitDateSettings);

          const packageFilter = data.packageItems
            .filter((item) => item.questions.length > 0)
            .map((item) => item.questionList);

          const maxLength = Math.max(...packageFilter.map((g) => g.length));

          const questionList = Array.from({ length: maxLength }, (_, i) =>
            packageFilter.map((group) => group[i]).flat()
          );

          const newData: any = {
            cartItemId: null,
            eventId: null,
            eventTime: null,
            guestInfoSameAsUserInfo: userInfo.sameAsLeader,
            guestUserInfo,
            guestInfo: userInfo.sameAsLeader ? guestUserInfo : guestInfo,
            packageItems,
            quantity: data.quantity,
            ticketTypeId: data.ticketTypeId,
            visitDate: null,
            visitDateSettings,
            questionList,
          };

          return addTocart(newData);
        })
      );

      //   ✅ SEE RESPONSE DATA HERE
      const lastResponse: any = responses[responses.length - 1];
      const itemsCount = lastResponse?.data?.addToCart?.itemsCount;
      setAddToCartCount(itemsCount);
      toast.success("Added to cart successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCart = async (list: string[]) => {
    setCheckoutLoading(true);
    setSelectedCartList([]);
    try {
      const res = await getAddToCart();
      if (res) {
        const data = res;
        setSelectedCartList(
          data.items.filter((item: any) => list.includes(item.id))
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setCheckoutLoading(false);

      navigate("/cart/checkout");
    }
  };

  return (
    <div
      className={
        "w-full border border-[#E2E8F080]/50 rounded-3xl overflow-hidden gap-5 px-8 py-4 flex flex-col"
      }
      style={{
        boxShadow: "0px 10px 15px -3px #0000001A",
      }}
    >
      <div className="flex items-center gap-6 bg-[#FFFBEB] p-4 rounded-[14px] border border-[#FEE685]">
        <StarsIcon className="w-5 h-5 text-[#E17100]" />
        {/* <Typo
          text="By confirming, you agree to our terms and conditions. You'll receive a confirmation email shortly."
          size="md"
          className="text-[#7B3306]"
          fontWeight="normal"
        /> */}
        <p className="text-[#7B3306]">
          By confirming, you agree to our terms and conditions. You'll receive a
          confirmation email shortly.
        </p>
      </div>
      <div className="w-full flex gap-4">
        <Button
          disabled={loading || checkoutLoading}
          onClick={handleCheckOut}
          size="lg"
          className="flex-1"
        >
          Buy Now
        </Button>
        <Button
          type="button"
          disabled={loading || checkoutLoading}
          onClick={handleSubmit}
          size="lg"
          className="flex-1 border-indigo-700 text-indigo-700"
          variant="outline"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default PackagePreViewCheckOut;
