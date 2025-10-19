"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/lib/api";

type AuthCtx = {
  isLoggedIn: boolean | null;
  userEmail: string | null;
  userName: string | null;
  userId: string | null;
  userRole: string | null;
  login: (opts?: {
    email?: string;
    name?: string;
    id?: string;
    role?: string;
  }) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const localEmail = localStorage.getItem("userEmail");
      const localName = localStorage.getItem("userName");
      const localId = localStorage.getItem("userId");
      const localRole = localStorage.getItem("userRole");

      if (localEmail && localName && localId) {
        if (!mounted) return;
        setIsLoggedIn(true);
        setUserEmail(localEmail);
        setUserName(localName);
        setUserId(localId);
        setUserRole(localRole);

        try {
          const resp = await getCurrentUser();
          if (!mounted) return;

          const user = resp?.data?.user;
          if (user) {
            const fullName = `${user.firstName || ""} ${
              user.lastName || ""
            }`.trim();
            setUserEmail(user.email ?? localEmail);
            setUserName(fullName || localName);
            setUserId(user.id ?? localId);
            setUserRole(user.role ?? localRole);

            if (user.email) localStorage.setItem("userEmail", user.email);
            if (fullName) localStorage.setItem("userName", fullName);
            if (user.id) localStorage.setItem("userId", user.id);
            if (user.role) localStorage.setItem("userRole", user.role);
          }
        } catch (err) {
          console.warn("Background auth verification failed:", err);
        }
        return;
      }

      try {
        const resp = await getCurrentUser();
        if (!mounted) return;

        const user = resp?.data?.user;
        if (user) {
          const fullName = `${user.firstName || ""} ${
            user.lastName || ""
          }`.trim();
          setIsLoggedIn(true);
          setUserEmail(user.email ?? null);
          setUserName(fullName);
          setUserId(user.id ?? null);
          setUserRole(user.role ?? null);

          if (user.email) localStorage.setItem("userEmail", user.email);
          if (fullName) localStorage.setItem("userName", fullName);
          if (user.id) localStorage.setItem("userId", user.id);
          if (user.role) localStorage.setItem("userRole", user.role);
        } else {
          setIsLoggedIn(false);
          setUserEmail(null);
          setUserName(null);
          setUserId(null);
          setUserRole(null);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Auth initialization failed:", err);
        setIsLoggedIn(false);
        setUserEmail(null);
        setUserName(null);
        setUserId(null);
        setUserRole(null);
      }
    };

    init();

    const onStorage = (e: StorageEvent) => {
      if (
        ["userEmail", "userName", "userId", "userRole", "auth-event"].includes(
          e.key || ""
        )
      ) {
        setUserEmail(localStorage.getItem("userEmail"));
        setUserName(localStorage.getItem("userName"));
        setUserId(localStorage.getItem("userId"));
        setUserRole(localStorage.getItem("userRole"));
        setIsLoggedIn(
          !!localStorage.getItem("userEmail") &&
            !!localStorage.getItem("userName") &&
            !!localStorage.getItem("userId")
        );
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const login = (opts?: {
    email?: string;
    name?: string;
    id?: string;
    role?: string;
  }) => {
    if (opts?.email) {
      localStorage.setItem("userEmail", opts.email);
      setUserEmail(opts.email);
    }
    if (opts?.name) {
      localStorage.setItem("userName", opts.name);
      setUserName(opts.name);
    }
    if (opts?.id) {
      localStorage.setItem("userId", opts.id);
      setUserId(opts.id);
    }
    if (opts?.role) {
      localStorage.setItem("userRole", opts.role);
      setUserRole(opts.role);
    }
    setIsLoggedIn(true);
    try {
      localStorage.setItem(
        "auth-event",
        JSON.stringify({ t: Date.now(), type: "login" })
      );
    } catch {}
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("logout API error", err);
    }
    ["userEmail", "userName", "userId", "userRole"].forEach((key) =>
      localStorage.removeItem(key)
    );
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserName(null);
    setUserId(null);
    setUserRole(null);
    try {
      localStorage.setItem(
        "auth-event",
        JSON.stringify({ t: Date.now(), type: "logout" })
      );
    } catch {}
    router.push("/login");
  };

  const refresh = async () => {
    try {
      const resp = await getCurrentUser();
      const user = resp?.data?.user;
      if (user) {
        const fullName = `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim();
        setIsLoggedIn(true);
        setUserEmail(user.email ?? null);
        setUserName(fullName);
        setUserId(user.id ?? null);
        setUserRole(user.role ?? null);

        if (user.email) localStorage.setItem("userEmail", user.email);
        if (fullName) localStorage.setItem("userName", fullName);
        if (user.id) localStorage.setItem("userId", user.id);
        if (user.role) localStorage.setItem("userRole", user.role);
      } else {
        setIsLoggedIn(false);
        setUserEmail(null);
        setUserName(null);
        setUserId(null);
        setUserRole(null);
      }
    } catch (err) {
      console.error("Auth refresh failed:", err);
      setIsLoggedIn(false);
      setUserEmail(null);
      setUserName(null);
      setUserId(null);
      setUserRole(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userEmail,
        userName,
        userId,
        userRole,
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
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
