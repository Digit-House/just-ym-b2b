import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import {
  CombinedProtocolErrors,
} from "@apollo/client/errors";
import { LSKeys, clearLSItem } from "../util/initData";
import { toast } from "sonner";
import { setErrorStatus } from "@/util/errorHandler";

const handleUnauthorized = () => {
  clearLSItem(LSKeys.callBack);
  clearLSItem(LSKeys.authStorage);
  clearLSItem(LSKeys.riaseAssmt);

  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

const handleGatewayTimeout = () => {
  // Store error status in localStorage for network error
  setErrorStatus(
    "network",
    "Failed to fetch data from the server. Please check your connection and try again.",
    window.location.pathname
  );
  
  toast.error("Gateway Timeout", {
    description: "The server took too long to respond. Please try again later.",
    duration: 5000,
  });
};

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

import { ErrorLink } from "@apollo/client/link/error";
import {
  CombinedGraphQLErrors,
  ServerError,
} from "@apollo/client/errors";

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach((err: any) => {
      // 🔑 Most backends send status here
      const statusCode =
        err?.extensions?.http?.status ||
        err?.extensions?.status ||
        err?.extensions?.code ||
        err?.status

      if (statusCode === 401 || err.message === "Unauthorized") {
        handleUnauthorized();
      }

      if (statusCode === 504) {
        handleGatewayTimeout();
      }
    });

    return;
  }

  if (error instanceof TypeError && error.message === "Failed to fetch") {
    // Store error status in localStorage for network error
    setErrorStatus(
      "network",
      "Failed to fetch data from the server. Please check your connection and try again.",
      window.location.pathname
    );
    handleGatewayTimeout();
  }

  /* ---------------- NETWORK ERRORS ---------------- */
  if (ServerError.is(error)) {
    
    const statusCode = error.statusCode; // ✅ REAL HTTP status

    if (statusCode === 401) {
      handleUnauthorized();
    }

    if (statusCode === 504) {
      handleGatewayTimeout();
    }

    // Handle 500 Internal Server Error
    if (statusCode === 500) {
      setErrorStatus(
        "server",
        error.bodyText || "Internal server error occurred. Please try again later.",
        window.location.pathname
      );
    }

    console.error("[Network error]", {
      statusCode,
      bodyText: error.bodyText,
    });

    return;
  }

  console.error("[Unknown error]", error);
});


const httpLink = new HttpLink({
  uri: import.meta?.env?.VITE_PUBLIC_API_URL || "https://stg-api.justym.me/graphql",
});

const link = ApolloLink.from([
  removeTypenameLink,
  errorLink,
  authLink,
  httpLink,
]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  //connectToDevTools: process.env.NODE_ENV !== "production",
});

export default client;
