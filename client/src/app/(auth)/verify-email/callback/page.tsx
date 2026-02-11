"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailToken } from "@/lib/api";
import { toast } from "sonner";

export default function VerifyEmailCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid verification link");
      return;
    }

    verifyEmailToken(token)
      .then(() => {
        toast.success("Email verified successfully");
        router.push("/onboarding/profile");
      })
      .catch(() => {
        toast.error("Invalid or expired link");
      });
  }, [token, router]);

  return null;
}
