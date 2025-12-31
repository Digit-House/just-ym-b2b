import { warpGql } from "@/util";
import client from "./client";
import { CREATE_USER, Me, USER_ROLES, USERS } from "./type-query/user";
import { UserRolesFilterT } from "@/types/user.type";
import { UserFormValues } from "@/types/schema/userSchema";

export const getMe = async () => {
  return client.query({
    query: warpGql(Me),
  });
};

export const getUserRoles = async (data: UserRolesFilterT) => {
  return client.query({
    query: warpGql(USER_ROLES),
    variables: {
      params: { ...data },
    },
  });
};

export const getAllUsers = async (data: UserRolesFilterT) => {
  return client.query({
    query: warpGql(USERS),
    variables: {
      params: { ...data },
    },
  });
};

export const postUser = async (payload: UserFormValues) => {
  return client.mutate({
    mutation: warpGql(CREATE_USER),
    variables: {
      data: {
        contactNo: payload.contactNo,
        countryCode: payload.countryCode,
        email: payload.email,
        imageURI: null,
        password: payload.password,
        roleIds: payload.roleIds,
        type: "OWNER",
        username: payload.userName,
      },
    },
  });
};
