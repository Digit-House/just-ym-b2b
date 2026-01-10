export interface GET_SIGNED_URL_TYPE {
    filename: string;
    folder: "CREDIT_TOP_UP" | "PRODUCT_MEDIA" | "USER_PROFILE";
    updateUrl?: string | null;
  }