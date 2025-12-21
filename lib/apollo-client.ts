import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

export const client = new ApolloClient({
  // Fix: Use createHttpLink instead of uri property
  link: createHttpLink({ uri: 'https://api.justym.me/graphql' }),
  cache: new InMemoryCache(),
});