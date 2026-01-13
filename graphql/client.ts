"use client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";

import { LSKeys, clearLSItem } from "../util/initData";

/* -------------------------------------------------
 * Helpers
 * ------------------------------------------------- */
const handleUnauthorized = () => {
  clearLSItem(LSKeys.callBack);
  clearLSItem(LSKeys.authStorage);
  clearLSItem(LSKeys.riaseAssmt);

  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

/* -------------------------------------------------
 * Remove __typename from variables
 * ------------------------------------------------- */
const removeTypename = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(removeTypename);
  }

  if (value !== null && typeof value === "object") {
    const { __typename, ...rest } = value;
    return Object.fromEntries(
      Object.entries(rest).map(([key, val]) => [key, removeTypename(val)])
    );
  }

  return value;
};

const removeTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = removeTypename(operation.variables);
  }

  return forward ? forward(operation) : null;
});

/* -------------------------------------------------
 * Auth Link (no deprecated setContext)
 * ------------------------------------------------- */
const authLink = new ApolloLink((operation, forward) => {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LSKeys.authStorage);
      if (raw) {
        const parsed = JSON.parse(raw);
        token = parsed?.state?.token ?? null;
      }
    } catch (err) {
      console.error("Auth parse error", err);
    }
  }

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward ? forward(operation) : null;
});

/* -------------------------------------------------
 * Error Link (Apollo Client v4)
 * ------------------------------------------------- */
const errorLink = new ErrorLink(({ error }) => {
  /* ---------- GraphQL Errors ---------- */
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach((err: any) => {
      const statusCode = err?.status;
      if (statusCode === 401 || err?.message === "Unauthorized") {
        handleUnauthorized();
      }

      console.error(
        `[GraphQL error]: ${err.message}`,
        err.locations,
        err.path
      );
    });
    return;
  }

  /* ---------- Protocol Errors ---------- */
  if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach((err: any) => {
      const status =
        err?.extensions?.http?.status ??
        err?.extensions?.response?.status;

      if (status === 401) {
        handleUnauthorized();
      }

      console.error(
        `[Protocol error]: ${err.message}`,
        err.extensions
      );
    });
    return;
  }

  /* ---------- Network Errors ---------- */
  const networkStatus =
    (error as any)?.statusCode ??
    (error as any)?.response?.status;

  if (networkStatus === 401) {
    handleUnauthorized();
  }

  console.error("[Network error]", error);
});

/* -------------------------------------------------
 * HTTP Link
 * ------------------------------------------------- */
const httpLink = new HttpLink({
  uri: "https://api.justym.me/graphql",
});

/* -------------------------------------------------
 * Link Chain (ORDER MATTERS)
 * ------------------------------------------------- */
const link = ApolloLink.from([
  removeTypenameLink,
  errorLink,
  authLink,
  httpLink,
]);

/* -------------------------------------------------
 * Apollo Client
 * ------------------------------------------------- */
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  //connectToDevTools: process.env.NODE_ENV !== "production",
});

export default client;
