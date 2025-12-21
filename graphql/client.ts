import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";
import { LSKeys, clearLSItem } from "../util/initData";

const removeTypenameLink = removeTypenameFromVariables();

const httpLink = createHttpLink({
  uri: 'https://api.justym.me/graphql',
});

const authLink = setContext((_, { headers }) => {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem(LSKeys.token) : null;
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

// Fix: Type error object as any to resolve property existence errors
const errorLink = onError((error: any) => {
  const { graphQLErrors, networkError } = error;
  if (graphQLErrors) {
    if (graphQLErrors.length > 0) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const error: any = graphQLErrors[0]?.extensions?.originalError || graphQLErrors[0];
      
      // Handle Unauthorized Access
      if (error?.statusCode === 401 || error?.message === 'Unauthorized') {
        clearLSItem(LSKeys.callBack);
        clearLSItem(LSKeys.token);
        clearLSItem(LSKeys.riaseAssmt);
        
        // Redirect to login or home if unauthorized
        if (typeof window !== 'undefined') {
             window.location.href = '/';
        }
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Construct the link chain using .concat() to avoid needing ApolloLink.from
const link = removeTypenameLink.concat(errorLink).concat(authLink).concat(httpLink);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;