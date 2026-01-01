import { getProductInfo } from "@/graphql/product";
import { ProductInfoT } from "@/types/product.type";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";


export const useTicketDetail = (id?: string) => {
  const [product, setProduct] = useState<ProductInfoT | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [activeTab, setActiveTab] = useState("highlights");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProduct(id);
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const res = await getProductInfo(productId);
      setProduct(res);

      // reset quantities based on first package
      const initialQs: Record<string, number> = {};
      res.productOptions[0]?.ticketType?.forEach(tt => {
        initialQs[tt.id] = 0;
      });
      setQuantities(initialQs);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  // ===== Derived Values =====
  const currentOption = useMemo(
    () => product?.productOptions[selectedOptionIndex] || null,
    [product, selectedOptionIndex]
  );

  const updateQuantity = (ticketId: string, delta: number) => {
    setQuantities(prev => ({
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
    return product.media?.length > 0 ? product.media : [{ path: product.image }];
  }, [product]);

  const nextMedia = () =>
    setCurrentMediaIndex(prev => (prev + 1) % mediaList.length);
  const prevMedia = () =>
    setCurrentMediaIndex(prev => (prev - 1 + mediaList.length) % mediaList.length);

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
  };
};
