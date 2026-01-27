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
import { toast } from "sonner";

const handleUnauthorized = () => {
  clearLSItem(LSKeys.callBack);
  clearLSItem(LSKeys.authStorage);
  clearLSItem(LSKeys.riaseAssmt);

  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

const handleGatewayTimeout = () => {
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

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach((err: any) => {
      const statusCode = err?.status;
      if (statusCode === 401 || err?.message === "Unauthorized") {
        handleUnauthorized();
      }
      
      // Handle 504 Gateway Timeout errors
      if (statusCode === 504) {
        handleGatewayTimeout();
      }

      console.error(`[GraphQL error]: ${err.message}`, err.locations, err.path);
    });
    return;
  }

  
  const networkStatus =
    (error as any)?.statusCode ?? (error as any)?.response?.status;

  if (networkStatus === 401) {
    handleUnauthorized();
  }
  
  // Handle 504 Gateway Timeout errors
  if (networkStatus === 504) {
    handleGatewayTimeout();
  }

  console.error("[Network error]", error);
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
