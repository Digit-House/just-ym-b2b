import { warpGql } from "@/util";
import client from "./client";
import { RoleFilterT } from "@/types/role.type";
import { GET_ALL_ROLES } from "./type-query/role";

export const getRoles = async (payload: RoleFilterT) => {
  return client.query({
    query: warpGql(GET_ALL_ROLES),
    variables: {
      params: { ...payload },
      fetchPolicy: "no-cache",
    },
  });
};
