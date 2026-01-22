import { SortOption } from "@/components/SortSelect";
import { QueryClient } from "@tanstack/react-query";

export const PAGE_SIZE=10;

export const LSKeys = {
  authStorage: "auth-storage",
  callBack: "callBack",
  riaseAssmt: "riaseAssmt",
};

export const SORT_OPTION: SortOption[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];


export const TOPUP_PRESETS = [
  { label: "THB 1K", amount: 1000, value: 1000 },
  { label: "THB 3K", amount: 3000, value: 2500 },
  { label: "THB 5K", amount: 5000, value: 5000 },
  { label: "THB 10K", amount: 10000, value: 10000 },
  { label: "THB 25K", amount: 25000, value: 25000 },
];


let queryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          gcTime: Infinity,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      },
    });
  }

  return queryClient;
};


export const clearLSItem = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export type ErrObj = {
  status: number;
  message: string;
  code: string;
};

export type ErrMsg = {
  errors: ErrObj[];
}

export const getErrMsg = (error: ErrMsg, type: "code" | "message") => {
  if (error?.errors.length > 0) {
    const errorMessage = error?.errors[0];
    if (type === "code") {
      return errorMessage.code;
    }
    return errorMessage.message;
  } else {
    return "Unexpected Error. Please Try Again Later !";
  }
};


export const preFixImg = (id:string) => {
  return id.includes(".com") ? id : `${import.meta.env.VITE_PUBLIC_IMG_URI}/file/image/${id}`;
}

export const bool = (value: boolean) => (value ? "Yes" : "No");