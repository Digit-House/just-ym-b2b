import { warpGql } from "@/util";
import client from "./client";
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_INFO,
  GET_PRODUCT_OPTIONS,
} from "./type-query/product";
import {
  FilterProductListT,
  FindAllProductsT,
  ProductInfoResponse,
  ProductInfoT,
  ProductOptionResponse,
  ProductOptionT,
} from "@/types/product.type";

export const getAllProducts = async (data: FilterProductListT) => {
  try {
    const res = await client.query({
      query: warpGql(GET_ALL_PRODUCTS),
      variables: {
        params: { ...data },
      },
      fetchPolicy: "no-cache",
    });
    //@ts-ignore
    return res.data.findAllProducts as FindAllProductsT;
  } catch (err) {
    throw err;
  }
};

export const getProductInfo = async (productId: string) => {
  try {
    const res: ProductInfoResponse = await client.query({
      query: warpGql(GET_PRODUCT_INFO),
      variables: {
        productId: productId,
      },
      fetchPolicy: "no-cache",
    });
    return res.data.getProductInfo as ProductInfoT;
  } catch (err) {
    throw err;
  }
};

export const fetchProducts = async ({ pageParam = 1, queryKey }: any) => {
  const [_key, { categories, countries, sort }] = queryKey;

  const filter = {
    category: categories[0] || "",
    cityId: "",
    countryId: countries[0] || "",
    limit: 10,
    page: pageParam,
    orderBy: { dir: sort },
  };

  const res = await getAllProducts(filter);
  return {
    data: res?.data,
    nextPage: res?.data?.length ? pageParam + 1 : null,
  };
};

export const getProductOptions = async (productId: string, date: Date) => {
  try {
    const res: ProductOptionResponse = await client.query({
      query: warpGql(GET_PRODUCT_OPTIONS),
      variables: {
        userProductId: productId,
        date: date,
      },
      fetchPolicy: "no-cache",
    });
    return res.data.user_product.productOptions as ProductOptionT[];
  } catch (err) {
    throw err;
  }
};
