"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoaderSpinner from "@/components/ui-elements/LoaderSpinner";

export default function DashboardRedirect() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push("/login");
      return;
    }

    if (!user?.role) return;

    if (user.role === "student") {
      router.replace("dashboard/student");
    } else if (user.role === "professor") {
      router.replace("dashboard/professor");
    }
  }, [user, isLoggedIn, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoaderSpinner />
    </div>
  );
}
