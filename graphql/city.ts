import { warpGql } from "@/util";
import client from "./client";
import { UPDATE_CITY } from "./type-query/queries";

export const putCity = async (id: string, isPublished: boolean) => {
  return client.mutate({
    mutation: warpGql(UPDATE_CITY),
    variables: {
      updateCityId: id,
      input: {
        isPublished: isPublished,
      },
    },
    fetchPolicy: "no-cache",
  });
};
