import { warpGql } from "@/util";
import client from "./client";
import { LOGIN } from "./type-query/auth";

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
