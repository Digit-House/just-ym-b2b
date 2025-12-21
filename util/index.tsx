import { gql } from "@apollo/client";

export const warpGql = (query: string) => {
    return gql`
        ${query}
      `;
  };