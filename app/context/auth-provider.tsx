"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider 
      // Refresh session every 5 minutes
      refetchInterval={5 * 60}
      // Force refresh when window focuses
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
} 