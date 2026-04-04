"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { browserLocalPersistence, onAuthStateChanged, setPersistence } from "firebase/auth";

import { AuthContext } from "@/components/auth/auth-context";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { authService } from "@/services/auth.service";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();

    void setPersistence(auth, browserLocalPersistence).catch(() => {
      setError("Não foi possível definir a persistência da sessão.");
    });

    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      () => {
        setError("Não foi possível validar a sessão atual.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signIn: async (email: string, password: string) => {
        setError(null);
        await authService.signIn(email, password);
      },
      signUp: async (email: string, password: string) => {
        setError(null);
        await authService.signUp(email, password);
      },
      signOutUser: async () => {
        setError(null);
        await authService.signOut();
      },
    }),
    [error, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
