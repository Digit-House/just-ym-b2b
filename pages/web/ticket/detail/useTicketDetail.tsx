import { getProductInfo, getProductOptions } from "@/graphql/product";
import {
  AVAILABILITY_ENUM,
  ProductInfoT,
  ProductOptionT,
  SelectedProductOptionT,
} from "@/types/product.type";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { addDays } from "date-fns";

export const useTicketDetail = (id?: string) => {
  const [product, setProduct] = useState<ProductInfoT | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [activeTab, setActiveTab] = useState("highlights");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [pickedDate, setPickedDate] = useState<Date>(addDays(new Date(), 1));
  const [loading, setLoading] = useState(false);
  const [optionLoading, setOptionLoading] = useState(false);
  const [productOptions, setProductOptions] = useState<ProductOptionT[]>([]);
  const [selectedProductOption, setSelectedProductOption] =
    useState<SelectedProductOptionT | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProduct(id);
  }, [id]);

  useEffect(() => {
    if (!id || !pickedDate) return;
    fetchProductOptions(id);
  }, [id, pickedDate]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const res = await getProductInfo(productId);
      setProduct(res);

      // reset quantities based on first package
      const initialQs: Record<string, number> = {};
      res.productOptions[0]?.ticketType?.forEach((tt) => {
        initialQs[tt.id] = 0;
      });
      setQuantities(initialQs);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductOptions = async (productId: string) => {
    setOptionLoading(true);
    setSelectedProductOption(null);
    try {
      const res = await getProductOptions(productId, pickedDate);
      const result = res.filter((item: any) =>
        [AVAILABILITY_ENUM.AVAILABLE, null].includes(item.availability)
      );
      setProductOptions(result);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load product");
    } finally {
      setOptionLoading(false);
    }
  };

  // ===== Derived Values =====
  const currentOption = useMemo(
    () => product?.productOptions[selectedOptionIndex] || null,
    [product, selectedOptionIndex]
  );

  const updateQuantity = (ticketId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + delta),
    }));
  };

  const totalPrice = useMemo(() => {
    if (!currentOption) return 0;
    return currentOption.ticketType.reduce((sum, tt) => {
      return sum + tt.dhSellingPrice * (quantities[tt.id] || 0);
    }, 0);
  }, [currentOption, quantities]);

  const mediaList = useMemo(() => {
    if (!product) return [];
    return product.media?.length > 0
      ? product.media
      : [{ path: product.image }];
  }, [product]);

  const nextMedia = () =>
    setCurrentMediaIndex((prev) => (prev + 1) % mediaList.length);
  const prevMedia = () =>
    setCurrentMediaIndex(
      (prev) => (prev - 1 + mediaList.length) % mediaList.length
    );

  return {
    loading,
    product,
    currentOption,
    quantities,
    selectedOptionIndex,
    setSelectedOptionIndex,
    updateQuantity,
    totalPrice,
    activeTab,
    setActiveTab,
    currentMediaIndex,
    setCurrentMediaIndex,
    mediaList,
    nextMedia,
    prevMedia,
    pickedDate,
    setPickedDate,
    optionLoading,
    setOptionLoading,
    productOptions,
    setProductOptions,
    selectedProductOption,
    setSelectedProductOption,
  };
};
