import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Fix: Import ApolloProvider from @apollo/client/react
import { ApolloProvider } from '@apollo/client/react';
import { client } from './graphql/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const query = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <QueryClientProvider client={query}>
      <App />
      </QueryClientProvider>
    </ApolloProvider>
  </React.StrictMode>
);