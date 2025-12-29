import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './graphql/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './util/initData';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <QueryClientProvider client={getQueryClient()}>
      <App />
      </QueryClientProvider>
    </ApolloProvider>
  </React.StrictMode>
);