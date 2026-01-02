import { warpGql } from "@/util";
import client from "./client";
import { GET_PRESIGNED_URL } from "./type-query/file";
import { GET_SIGNED_URL_TYPE } from "@/types/file.type";

export const getSignedUrl = (data: GET_SIGNED_URL_TYPE) => {
  return client.query({
    query: warpGql(GET_PRESIGNED_URL),
    variables: {
      input: data,
    },
    fetchPolicy: "no-cache",
  });
};


