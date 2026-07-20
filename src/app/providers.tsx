"use client";

import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ApolloClientProvider } from "@/lib/apollo/provider";
import { ToastProvider } from "@/components/ui/toast";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ApolloClientProvider>
        <ToastProvider>{children}</ToastProvider>
      </ApolloClientProvider>
    </AuthProvider>
  );
}
