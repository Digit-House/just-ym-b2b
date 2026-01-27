import { getAddToCart } from "@/graphql/product";
import { useCartStore } from "@/store/useCartStore";
import {
  ADD_TO_CART_DATA_TYPE,
  ADD_TO_CART_ITEM_DATA_TYPE,
} from "@/types/product.type";
import { getErrMsg } from "@/util/initData";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ADD_TO_CART_DATA_TYPE | null>(null);
  const [addToCartList, setAddToCartList] = useState<
    ADD_TO_CART_ITEM_DATA_TYPE[][][]
  >([]);
  const [tickeGroupedArray, setTickerGroupedArray] = useState<
    ADD_TO_CART_ITEM_DATA_TYPE[][]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { setSelectedCartList, selectedCartList } = useCartStore();

  const fetchMyCart = async () => {
    setLoading(true);

    try {
      const res = await getAddToCart();
      setSelectedCartList([]);
      if (res) {
        setData(res);
      }
    } catch (e) {
      toast.error(getErrMsg(e, "message"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCart();
  }, []);

  /* ---------------------------------------------
   * TOTAL PRICE
   * ------------------------------------------- */
  useEffect(() => {
    setTotalPrice(
      selectedCartList.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    );
  }, [selectedCartList]);

  useEffect(() => {
    if (!data) return;
    const groupedArray = Object.values(
      data.items.reduce((acc: Record<string, typeof data.items>, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = [];
        }
        acc[item.productId].push(item);
        return acc;
      }, {})
    );
    const productOptionGroupedArray: any = groupedArray.map((item) => {
      return Object.values(
        item.reduce((acc: any, item) => {
          if (!acc[item.productOptionId]) {
            acc[item.productOptionId] = [];
          }
          acc[item.productOptionId].push(item);
          return acc;
        }, {})
      );
    });
    setTickerGroupedArray(groupedArray);
    setAddToCartList(productOptionGroupedArray);
  }, [data]);

  return {
    loading,
    setLoading,
    data,
    setData,
    totalPrice,
    setTotalPrice,
    addToCartList,
    setAddToCartList,
    tickeGroupedArray,
    setTickerGroupedArray,
  };
};
