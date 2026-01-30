import { warpGql } from "@/util";
import client from "./client";
import { CREATE_CATEGORY, UPDATE_CATEGORY } from "./type-query/queries";
import { CategoryFormValues } from "@/types/schema/categorySchema";

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


export const putCategory = async (data:CategoryFormValues) => {
  return client.mutate({
    mutation: warpGql(UPDATE_CATEGORY),
    variables: {
      data: {
        id:data.id,
        name_mm:data.name_mm,
        image:data.image,
        showOnLanding:data.showOnLanding
      },
      fetchPolicy: "no-cache",
    },
  });
}