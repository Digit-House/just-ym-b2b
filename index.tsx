import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './graphql/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './util/initData';
import { Toaster } from './components/ui/sonner';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // <React.StrictMode>
  <Fragment>
    <ApolloProvider client={client}>
      <QueryClientProvider client={getQueryClient()}>
      <App />
      </QueryClientProvider>
    </ApolloProvider>
    <Toaster richColors />
    </Fragment>
  // </React.StrictMode>
);