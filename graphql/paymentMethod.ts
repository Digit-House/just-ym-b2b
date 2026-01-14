import { warpGql } from "@/util";
import client from "./client";
import {
  CREATE_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD,
  GET_PAYMENT_METHODS,
  UPDATE_PAYMENT_METHOD,
} from "./type-query/paymentMethod";
import { PaymentMethodFormValues } from "@/types/schema/paymentMethodSchema";
import { PaymentMethodTypeT } from "@/types/paymentMethod.type";

export const getPaymentMethods = async (activeOnly: boolean,type:PaymentMethodTypeT) => {
  return client.query({
    query: warpGql(GET_PAYMENT_METHODS),
    variables: {
      activeOnly: activeOnly,
      type:type
    },
    fetchPolicy: "no-cache",
  });
};

export const postPaymentMethod = async (data: PaymentMethodFormValues) => {
  return client.mutate({
    mutation: warpGql(CREATE_PAYMENT_METHOD),
    variables: {
      input: {
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        description: data.description,
        instructions: data.instructions,
        isActive: data.isActive,
        logo: data.logo,
        name: data.name,
        qrCodeUrl: data.qrCodeUrl,
        type: data.type,
      },
    },
  });
};

export const putPaymentMethod = async (data: PaymentMethodFormValues) => {
  return client.mutate({
    mutation: warpGql(UPDATE_PAYMENT_METHOD),
    variables: {
      input: {
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        description: data.description,
        id: data.id,
        instructions: data.instructions,
        isActive: data.isActive,
        logo: data.logo,
        name: data.name,
        qrCodeUrl: data.qrCodeUrl,
        type: data.type,
      },
    },
    fetchPolicy: "no-cache",
  });
};

export const removePaymentMethod = async (id: string) => {
  return client.mutate({
    mutation: warpGql(DELETE_PAYMENT_METHOD),
    variables: {
      removePaymentMethodId: id,
    },
  });
};
