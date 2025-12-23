import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login, me } from "./authService";
import type { MeDto } from "../shared/types";

type AuthState = {
  isAuthenticated: boolean;
  currentUser: MeDto | null;
  doLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [currentUser, setCurrentUser] = useState<MeDto | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setCurrentUser(null);
        return;
      }

      const res = await me();
      if (res.success && res.data) setCurrentUser(res.data);
      else {
        // token inválido/expirado
        localStorage.removeItem("accessToken");
        setToken(null);
        setCurrentUser(null);
      }
    };

    load();
  }, [token]);

  const value = useMemo<AuthState>(() => ({
    isAuthenticated: !!token,
    currentUser,
    doLogin: async (email, password) => {
      const res = await login(email, password);
      if (!res.success || !res.data?.accessToken) return false;

      localStorage.setItem("accessToken", res.data.accessToken);
      setToken(res.data.accessToken);

      // currentUser será carregado pelo useEffect acima
      return true;
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      setToken(null);
      setCurrentUser(null);
    }
  }), [token, currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext not found");
  return ctx;
}
