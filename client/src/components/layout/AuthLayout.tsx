"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoaderSpinner from "../ui-elements/LoaderSpinner";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn === null) return;

    if (isLoggedIn === false) {
      router.push("/login");
      return;
    }

    setLoading(false);
  }, [isLoggedIn, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthLayout;
