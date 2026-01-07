import { warpGql } from "@/util";
import client from "./client";
import { CREATE_CATEGORY } from "./type-query/queries";

export const postCategory = async (name: string) => {
  return client.mutate({
    mutation: warpGql(CREATE_CATEGORY),
    variables: {
      data: {
        name: name,
      },
      fetchPolicy: "no-cache",
    },
  });
};
