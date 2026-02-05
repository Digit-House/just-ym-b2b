import { warpGql } from "@/util";
import client from "./client";
import { LOGIN, LOGIN_WITH_TWO_FACTOR } from "./type-query/auth";

export const login = async (email: string, password: string) => {
  return client.mutate({
    mutation: warpGql(LOGIN),
    variables: {
      email,
      password,
      site: "AGENT",
    },
    fetchPolicy: "no-cache",
  });
};


export const loginWithTwoFactor = async (code: string, twoFactorToken: string) => {
  return client.mutate({
    mutation: warpGql(LOGIN_WITH_TWO_FACTOR),
    variables: {
      input: {
        code,
        twoFactorToken,
      },
    },
    fetchPolicy: "no-cache",
  });
};

//loginWithTwoFactor response is the same as login 
