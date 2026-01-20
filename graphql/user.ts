import { warpGql } from "@/util";
import client from "./client";
import {
  CHANGE_PASSWORD,
  CREATE_USER,
  Me,
  UPDATE_USER,
  USER_ROLES,
  USERS,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from "./type-query/user";
import { UserChangePasswordT, UserRolesFilterT } from "@/types/user.type";
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

export const updatePassword = async (payload: UserChangePasswordT) => {
  return client.mutate({
    mutation: warpGql(CHANGE_PASSWORD),
    variables: {
      input: {
        newPassword: payload.newPassword,
        oldPassword: payload.oldPassword,
      },
    },
    fetchPolicy: "no-cache",
  });
};

export const forgotPassword = async (email: string) => {
  return client.mutate({
    mutation: warpGql(FORGOT_PASSWORD),
    variables: {
      input: {
        email,
      },
    },
    fetchPolicy: "no-cache",
  });
};

export const resetPassword = async (code: string, newPassword: string) => {
  return client.mutate({
    mutation: warpGql(RESET_PASSWORD),
    variables: {
      input: {
        code,
        newPassword,
      },
    },
    fetchPolicy: "no-cache",
  });
};
