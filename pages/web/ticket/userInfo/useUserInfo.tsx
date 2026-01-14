import { getTicketTypeEventAvailable } from "@/graphql/product";
import { useCartStore } from "@/store/useCartStore";
import {
  ADD_TO_CART_USER_TYPE,
  EVENT_AVAILABLE_DATA_TYPE,
} from "@/types/product.type";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useUserInfo = () => {
  const [userInfoCheck, setUserInfoCheck] = useState(false);
  const [timeInfoCheck, setTimeInfoCheck] = useState(false);
  const [variantCheck, setVariantCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentOpen, setCurrentOpen] = useState(1);
  const { finalPackage, eventList, guestList } = useCartStore();

  useEffect(() => {
    if (!finalPackage?.isCapacity || eventList.length === 0) {
      setTimeInfoCheck(true);
    }
    if (finalPackage?.questions.length === 0) {
      setVariantCheck(true);
    } else {
      const newVariantCheck = guestList.every((data) => data.isFilled);
      setVariantCheck(newVariantCheck);
    }
  }, []);

  return {
    userInfoCheck,
    setUserInfoCheck,
    timeInfoCheck,
    setTimeInfoCheck,
    variantCheck,
    setVariantCheck,
    loading,
    setLoading,
    currentOpen,
    setCurrentOpen,
  };
};
