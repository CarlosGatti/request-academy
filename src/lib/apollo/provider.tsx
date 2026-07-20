"use client";

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { useMemo, type ReactNode } from "react";
import { intVariablesLink } from "@/lib/apollo/int-variables-link";
import { getAccessToken } from "@/lib/auth/token";
import { clientEnv } from "@/lib/env/client";

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: clientEnv.NEXT_PUBLIC_GRAPHQL_URL,
  });

  const authLink = setContext((_, previousContext) => {
    const token = getAccessToken();
    const headers = {
      ...(previousContext.headers as Record<string, string> | undefined),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return { headers };
  });

  return new ApolloClient({
    link: from([authLink, intVariablesLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
  });
}

export function ApolloClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => createApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
