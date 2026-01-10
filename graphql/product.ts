import { warpGql } from "@/util";
import client from "./client";
import {
  ADD_TO_CART_DATA_TYPE,
  ADD_TO_CART_MUTATION,
  GET_ALL_PRODUCTS,
  GET_PRODUCT_INFO,
  GET_PRODUCT_OPTIONS,
  GET_TICKET_TYPE_EVENT_AVAILABLE,
  TICKET_TYPE_EVENT_AVAILABLE_DATA_TYPE,
} from "./type-query/product";
import {
  EVENT_AVAILABLE_DATA_TYPE,
  FilterProductListT,
  FindAllProductsT,
  ProductInfoResponse,
  ProductInfoT,
  ProductOptionResponse,
  ProductOptionT,
  TicketTypeEventAvailableResponse,
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
  const [_key, { categories, countries, sort, published }] = queryKey;

  const filter = {
    category: categories[0] || "",
    cityId: "",
    countryId: countries[0] || "",
    limit: 10,
    page: pageParam,
    published: published,
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

export const getTicketTypeEventAvailable = async (
  data: TICKET_TYPE_EVENT_AVAILABLE_DATA_TYPE
) => {
  try {
    const res: TicketTypeEventAvailableResponse = await client.query({
      query: warpGql(GET_TICKET_TYPE_EVENT_AVAILABLE),
      variables: {
        data: data,
      },
      fetchPolicy: "no-cache",
    });
    return res.data.checkEventAvailability as EVENT_AVAILABLE_DATA_TYPE[];
  } catch (err) {
    throw err;
  }
};

export const addTocart = async (data: ADD_TO_CART_DATA_TYPE) => {
  try {
    const res = await client.mutate({
      mutation: warpGql(ADD_TO_CART_MUTATION),
      variables: {
        item: data,
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
};
