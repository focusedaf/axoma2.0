"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoaderSpinner from "../ui-elements/LoaderSpinner";

interface AuthLayoutProps {
  children: ReactNode;
}

const AL: React.FC<AuthLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = () => {
      const email = localStorage.getItem("userEmail");

      if (!email) {
        router.push("/register");
        return;
      }

      if (isLoggedIn === true) setIsLoading(false);
      if (isLoggedIn === false) router.push("/login");
    };

    init();
  }, [isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LoaderSpinner color="white" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AL;
