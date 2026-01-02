import { QueryClient } from "@tanstack/react-query";

export const LSKeys = {
  authStorage: "auth-storage",
  callBack: "callBack",
  riaseAssmt: "riaseAssmt",
};


export const TOPUP_PRESETS = [
  { label: "THB 1K", amount: 1000, value: 1000 },
  { label: "THB 3K", amount: 3000, value: 2500 },
  { label: "THB 5K", amount: 5000, value: 5000 },
  { label: "THB 10K", amount: 10000, value: 10000 },
  { label: "THB 25K", amount: 25000, value: 25000 },
];


export const getQueryClient = () => {
 return new QueryClient();
}

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
  return `https://api.justym.me/file/image/${id}`;
}