"use client";

import { useEffect } from "react";
import { sendEmailVerification } from "@/lib/api";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  useEffect(() => {
    sendEmailVerification()
      .then(() => {
        toast.success("Verification link sent to your email");
      })
      .catch(() => {
        toast.error("Failed to send verification email");
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-bold">Verify your email</h1>
      <p className="text-center text-muted-foreground">
        We’ve sent a magic link to your email.
        <br />
        Click the link to continue.
      </p>
    </div>
  );
}
