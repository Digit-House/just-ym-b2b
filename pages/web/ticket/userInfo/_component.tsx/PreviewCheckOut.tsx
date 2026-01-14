import { Button } from "@/components/ui/button";
import { addTocart } from "@/graphql/product";
import { useCartStore } from "@/store/useCartStore";
import { ADD_TO_CART_USER_TYPE } from "@/types/product.type";
import { StarsIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  disable: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const PreViewCheckOut = ({ disable, loading, setLoading }: Props) => {
  const { answerList, setAddToCartCount, user } = useCartStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const responses = await Promise.all(
        answerList.map((data) => {
          const guestUserInfo = {
            customerName: user.name,
            email: user.email,
            mobileNumber: user.phone || null,
          };

          const guestInfo = {
            customerName: user.leaderName,
            email: user.leaderEmail,
            mobileNumber: user.leaderPhone || null,
          };

          const newData: any = {
            ...data,
            guestInfoSameAsUserInfo: user.sameAsLeader,
            guestUserInfo,
            guestInfo: user.sameAsLeader ? guestUserInfo : guestInfo,
          };

          return addTocart(newData);
        })
      );

      // ✅ SEE RESPONSE DATA HERE
      const lastResponse: any = responses[responses.length - 1];
      const itemsCount = lastResponse?.data?.addToCart?.itemsCount;
      setAddToCartCount(itemsCount);
      toast.success("Added to cart successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 500);
      // router.back();
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
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
      <Button
        type="button"
        disabled={disable || loading}
        onClick={handleSubmit}
        size="lg"
      >
        Confirm to Add to Cart
      </Button>
    </div>
  );
};

export default PreViewCheckOut;
