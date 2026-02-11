"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/lib/api";

type AuthCtx = {
  isLoggedIn: boolean | null;
  user: {
    email?: string;
    name?: string;
    id?: string;
    role?: string;
  } | null;
  login: () => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<AuthCtx["user"]>(null);
  const router = useRouter();

  const hydrateFromSession = async () => {
    try {
      const resp = await getCurrentUser();
      const u = resp?.data?.user;

      if (!u) throw new Error("No user");

      setIsLoggedIn(true);
      setUser({
        email: u.email,
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        id: u.id,
        role: u.role,
      });
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    hydrateFromSession();
  }, []);

  const login = () => {
    hydrateFromSession();
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}

    setIsLoggedIn(false);
    setUser(null);
    router.push("/login");
  };

  const refresh = async () => {
    await hydrateFromSession();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
