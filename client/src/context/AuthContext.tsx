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
      console.log("🔍 API Response:", resp?.data); 

      const u = resp?.data?.data?.user; 

      if (!u) throw new Error("No user");

      const role =
        u.role ||
        localStorage.getItem("auth_role") ||
        localStorage.getItem("pending_role");

      console.log("User data:", u); 
      console.log(" Role:", role); 

      setIsLoggedIn(true);
      setUser({
        email: u.email,
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        id: u.userId || u.id,
        role: role,
      });

      if (role) {
        localStorage.setItem("auth_role", role);
      }
    } catch (error) {
      console.error(" Hydration error:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    hydrateFromSession();
  }, []);

  const login = async () => {
    hydrateFromSession();
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}


    localStorage.removeItem("auth_role");
    localStorage.removeItem("pending_role");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");

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
