import { warpGql } from "@/util";
import client from "./client";
import {UPDATE_COUNTRY } from "./type-query/queries";

export const putCountry = async (id: string, isPublished: boolean) => {
  return client.mutate({
    mutation: warpGql(UPDATE_COUNTRY),
    variables: {
        updateCountryId: id,
      input: {
        isPublished: isPublished,
      },
    },
    fetchPolicy: "no-cache",
  });
};
