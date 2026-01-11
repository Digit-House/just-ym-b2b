import { warpGql } from "@/util";
import client from "./client";
import {
  CREATE_USER,
  Me,
  UPDATE_USER,
  USER_ROLES,
  USERS,
} from "./type-query/user";
import { UserRolesFilterT } from "@/types/user.type";
import { UserFormValues } from "@/types/schema/userSchema";

export const getMe = async () => {
  return client.query({
    query: warpGql(Me),
    fetchPolicy: "no-cache",
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
    fetchPolicy: "no-cache",
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
        resellerId: payload.resellerId || null,
        password: payload.password,
        roleIds: payload.roleIds,
        username: payload.username,
      },
      fetchPolicy: "no-cache",
    },
  });
};

export const updateUser = async (payload: UserFormValues, userId: string) => {
  return client.mutate({
    mutation: warpGql(UPDATE_USER),
    variables: {
      input: {
        active: payload.active,
        userId: userId,
      },
    },
  });
};
