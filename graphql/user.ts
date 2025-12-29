import { warpGql } from "@/util";
import client from "./client";
import { Me } from "./type-query/user";

export const getMe = async () => {
  return client.query({
    query: warpGql(Me),
  });
};
