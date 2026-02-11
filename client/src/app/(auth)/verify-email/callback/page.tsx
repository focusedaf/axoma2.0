"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailToken } from "@/lib/api";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid verification link");
      toast.error("Invalid verification link");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmailToken(token);
        setStatus("success");
        toast.success("Email verified successfully!");

        localStorage.removeItem("userEmail");
        localStorage.removeItem("userPhone");

        setTimeout(() => {
          router.push("/onboarding/profile");
        }, 2000);
      } catch (error: any) {
        setStatus("error");
        const message =
          error?.response?.data?.message || "Invalid or expired link";
        setErrorMessage(message);
        toast.error(message);
      }
    };

    verify();
  }, [token, router]);

  return (
    <Suspense>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          {status === "loading" && (
            <>
              <Spinner className="h-12 w-12" />
              <h1 className="text-2xl font-bold">Verifying Your Email...</h1>
              <p className="text-muted-foreground">Please wait a moment</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-green-600">
                Email Verified!
              </h1>
              <p className="text-muted-foreground">
                Redirecting you to complete your profile...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-red-600">
                Verification Failed
              </h1>
              <p className="text-muted-foreground">{errorMessage}</p>
              <div className="flex flex-col gap-2 mt-4 w-full">
                <Button onClick={() => router.push("/verify-email")}>
                  Request New Link
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  variant="outline"
                >
                  Back to Register
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}
