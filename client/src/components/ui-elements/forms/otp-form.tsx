"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
// import { verifyOtp, generateOtp } from "@/lib/api";
// import { useAuth } from "@/components/context/AuthContext";

interface OTPFormProps extends React.ComponentProps<"div"> {
  email?: string;
}

export function OTPForm({ className, email, ...props }: OTPFormProps) {
  const router = useRouter();
  // const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otp, setOtp] = useState("");

  const userEmail =
    email ||
    (typeof window !== "undefined" ? localStorage.getItem("userEmail") : null);

  const handleSendOtp = async () => {
    if (!userEmail) {
      toast.error("Session expired. Please register again.");
      // router.push("/register");
      return;
    }
    if (isSending || resendTimer > 0) return;

    try {
      setIsSending(true);
      // await generateOtp({ userEmail });
      toast.success("OTP sent to your email!");
      setResendTimer(60);

      // countdown for resend
      const countdown = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isVerifying) return;

    if (!userEmail) {
      toast.error("Session expired. Please register again.");
      // router.push("/register");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a complete 6-digit code");
      return;
    }

    try {
      setIsVerifying(true);
      // const response = await verifyOtp({ userEmail, otp });

      // if (response.data.success) {
      //   login({ email: userEmail });
      //   toast.success("OTP verified successfully!");
      //   router.push("/login");
      // } else {
      //   toast.error(response.data.message);
      // }
      setTimeout(() => {
        setIsLoading(false);
        router.push("/onboarding/profile");
      }, 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error verifying OTP");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Enter verification code</h1>
            <FieldDescription>
              We sent a 6-digit code to {userEmail || "your email address"}
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
              maxLength={6}
              id="otp"
              value={otp}
              onChange={(value) => setOtp(value)}
              required
              containerClassName="gap-4"
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSending || resendTimer > 0}
                className="underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending
                  ? "Sending..."
                  : resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : "Resend"}
              </button>
            </FieldDescription>
          </Field>
          <FieldGroup className="flex flex-col sm:flex-row gap-2 items-stretch">
            <Field>
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={isSending || resendTimer > 0}
                className="w-1/2"
              >
                {isSending ? (
                  <Spinner />
                ) : resendTimer > 0 ? (
                  `Resend in ${resendTimer}s`
                ) : (
                  "Send OTP"
                )}
              </Button>
            </Field>
            <Field>
              <Button
                className="w-1/2"
                type="submit"
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? <Spinner /> : "Verify"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
