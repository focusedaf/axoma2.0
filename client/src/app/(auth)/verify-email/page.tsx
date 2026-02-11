"use client";
import { useState, useEffect } from "react";
import { sendEmailVerification } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Mail, CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);

    if (!email) {
      toast.error("Session expired. Please register again.");
    }
  }, []);

  const handleSendEmail = async () => {
    if (!userEmail) {
      toast.error("Email not found. Please register again.");
      return;
    }

    if (isSending) return;

    try {
      setIsSending(true);
      await sendEmailVerification(userEmail); 
      setEmailSent(true);
      toast.success("Verification link sent to your email!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to send verification email",
      );
    } finally {
      setIsSending(false);
    }
  };

  if (!userEmail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-600">Session expired. Please register again.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="rounded-full bg-primary/10 p-4">
          <Mail className="h-12 w-12 text-primary" />
        </div>

        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground">{userEmail}</p>

        {!emailSent ? (
          <>
            <p className="text-muted-foreground">
              Click the button below to receive a verification link.
            </p>

            <Button
              onClick={handleSendEmail}
              disabled={isSending}
              size="lg"
              className="mt-4"
            >
              {isSending ? <Spinner /> : "Send Verification Link"}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium">Email Sent!</p>
            </div>

            <p className="text-muted-foreground">
              We've sent a verification link to your email. Click the link to
              continue.
            </p>

            <div className="flex flex-col gap-2 mt-4 w-full">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email?
              </p>
              <Button
                onClick={handleSendEmail}
                disabled={isSending}
                variant="outline"
              >
                {isSending ? <Spinner /> : "Resend Link"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
