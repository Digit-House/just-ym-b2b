import { warpGql } from "@/util";
import client from "./client";
import { RoleFilterT } from "@/types/role.type";
import { CREATE_ROLE, GET_ALL_ROLES, REMOVE_ROLE } from "./type-query/role";
import { RoleFormValues } from "@/types/schema/roleSchema";

export const getRoles = async (payload: RoleFilterT) => {
  return client.query({
    query: warpGql(GET_ALL_ROLES),
    variables: {
      params: { ...payload },
    },
    fetchPolicy: "no-cache",
  });
};

export const postRole = async (payload: RoleFormValues) => {
  return client.mutate({
    mutation: warpGql(CREATE_ROLE),
    variables: {
      data: {
        ...payload,
      },
    },
  });
};

export const removeRole = async (id: string) => {
  return client.mutate({
    mutation: warpGql(REMOVE_ROLE),
    variables: {
      removeRoleId: id,
    },
  });
};
