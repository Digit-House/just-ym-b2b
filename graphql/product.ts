import { warpGql } from "@/util";
import client from "./client";
import {
  ADD_TO_CART_DATA_TYPE,
  ADD_TO_CART_MUTATION,
  ALL_CLEAR_CART_MUTATION,
  CLEAR_CART_MUTATION,
  GET_ADD_TO_CART_COUNT_QUERY,
  GET_ADD_TO_CART_QUERY,
  GET_ALL_PRODUCTS,
  GET_PRODUCT_INFO,
  GET_PRODUCT_OPTIONS,
  GET_TICKET_TYPE_EVENT_AVAILABLE,
  SEED_PRODUCT_MUTATION,
  TICKET_TYPE_EVENT_AVAILABLE_DATA_TYPE,
  UPDATE_PRODUCT_MUTATION,
  UPDATE_PRODUCT_POSITION,
  EXPORT_PRODUCTS_REPORT,
  CREATE_NEW_PRODUCT,
} from "./type-query/product";
import {
  AddToCartResponse,
  EVENT_AVAILABLE_DATA_TYPE,
  FilterProductListT,
  FindAllProductsT,
  ProductInfoResponse,
  ProductInfoT,
  ProductPositionT,
  TicketTypeEventAvailableResponse,
  UpdateProductPayloadT,
} from "@/types/product.type";
import { GenReportResT } from "@/types/report.type";

export const getProductInfo = async (
  productId: string,
  includeRelated?: boolean
) => {
  try {
    const res: ProductInfoResponse = await client.query({
      query: warpGql(GET_PRODUCT_INFO),
      variables: {
        productId: productId,
        includeRelated: includeRelated || false,
      },
      fetchPolicy: "no-cache",
    });
    return res.data.getProductInfo as ProductInfoT | UpdateProductPayloadT;
  } catch (err) {
    throw err;
  }
};

export const getRelatedProductInfo = async (
  productId: string,
  includeRelated?: boolean
) => {
  try {
    const res: ProductInfoResponse = await client.query({
      query: warpGql(GET_PRODUCT_INFO),
      variables: {
        productId: productId,
        includeRelated: includeRelated || false,
      },
      fetchPolicy: "no-cache",
    });
    return res.data.getProductInfo as ProductInfoT | UpdateProductPayloadT;
  } catch (err) {
    throw err;
  }
};

export const updateProductInfo = async (data: UpdateProductPayloadT) => {
  try {
    const res = await client.mutate({
      mutation: warpGql(UPDATE_PRODUCT_MUTATION),
      variables: {
        data: {
          ...data,
        },
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
};

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

export const fetchProducts = async ({ pageParam = 1, queryKey }: any) => {
  const [
    _key,
    { categories, countryId, cityId, sort, published, search, isRecommended },
  ] = queryKey;

  const filter = {
    categoryIds: categories || [],
    category: "",
    cityId: cityId || "",
    countryId: countryId || "",
    limit: 10,
    page: pageParam,
    published: published,
    isRecommended: isRecommended,
    orderBy: {
      dir: sort?.toLowerCase() === "alphabet" ? "asc" : sort,
      field:
        sort?.toLowerCase() === "alphabet" ? "name" : ("updatedAt" as string),
    },
    name: search,
  };

  const res = await getAllProducts(filter);
  return {
    data: res?.data,
    total: res?.total,
    nextPage: res?.data?.length ? pageParam + 1 : null,
  };
};

export const fetchRecommendedProducts = async () => {
  const filter = {
    category: "",
    cityId: "",
    countryId: "",
    categoryIds: [],
    limit: 50,
    page: 1,
    published: "PUBLISHED" as any,
    isRecommended: true,
    orderBy: { dir: "asc", field: "isRecommended" as string },
    name: undefined,
  };
  const res = await getAllProducts(filter);
  return res;
};

export const relatedProducts = async (
  ticketId: string,
  isPublished: boolean
) => {
  const filter = {
    category: "",
    cityId: "",
    countryId: "",
    categoryIds: [],
    limit: 10,
    page: 1,
    isRecommended: false,
    relatedFromProductId: ticketId,
    published: isPublished ? "PUBLISHED" : ("UNPUBLISHED" as any),
    orderBy: { dir: "asc", field: "name" as string },
    name: undefined,
  };
  const res = await getAllProducts(filter);
  return res;
};

//for submit
export const updateRecommendedProductPosition = async (
  data: ProductPositionT[]
) => {
  try {
    const res = await client.mutate({
      mutation: warpGql(UPDATE_PRODUCT_POSITION),
      variables: {
        data: { products: data },
      },
      fetchPolicy: "no-cache",
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const getProductOptions = async (productId: string, date: string) => {
  try {
    const res: ProductInfoResponse = await client.query({
      query: warpGql(GET_PRODUCT_OPTIONS),
      variables: {
        productId: productId,
        date: date,
        isPublished: true,
      },
      fetchPolicy: "no-cache",
    });
    return res.data.getProductInfo as ProductInfoT;
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

export const getAddToCartCount = async () => {
  try {
    const res = await client.query({
      query: warpGql(GET_ADD_TO_CART_COUNT_QUERY),
      fetchPolicy: "no-cache",
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const getAddToCart = async () => {
  try {
    const res: AddToCartResponse = await client.query({
      query: warpGql(GET_ADD_TO_CART_QUERY),
      fetchPolicy: "no-cache",
    });
    return res.data.myCart;
  } catch (err) {
    throw err;
  }
};

export const allClearCart = async () => {
  try {
    const res = await client.mutate({
      mutation: warpGql(ALL_CLEAR_CART_MUTATION),
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const clearCart = async (cartItemId: string) => {
  try {
    const res = await client.mutate({
      mutation: warpGql(CLEAR_CART_MUTATION),
      variables: {
        cartItemId: cartItemId,
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const seedProduct = async (productId: string) => {
  try {
    const res = await client.mutate({
      mutation: warpGql(SEED_PRODUCT_MUTATION),
      variables: {
        productId: productId,
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const createNewProduct = async (globaltixProductId: number) => {
  try {
    const res = await client.mutate({
      mutation: warpGql(CREATE_NEW_PRODUCT),
      variables: {
        globaltixProductId: globaltixProductId,
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export interface ProductReportInput {
  isPublished?: boolean;
}

export const exportProductsReport = async (data: ProductReportInput) => {
  try {
    const res: any = await client.query({
      query: warpGql(EXPORT_PRODUCTS_REPORT),
      variables: {
        data: data,
      },
      fetchPolicy: "no-cache",
    });

    return res.data.exportProductsReport as GenReportResT;
  } catch (err) {
    throw err;
  }
};
