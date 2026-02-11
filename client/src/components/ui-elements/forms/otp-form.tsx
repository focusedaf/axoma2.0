"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
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
import { verifyOtp, generateOtp } from "@/lib/api";

interface OTPFormProps extends React.ComponentProps<"div"> {}

export function OTPForm({ className, ...props }: OTPFormProps) {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("userPhone");
    setPhoneNumber(stored);
  }, []);

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      toast.error("Session expired. Please register again.");
      return;
    }

    if (isSending) return;

    try {
      setIsSending(true);
      await generateOtp(phoneNumber);
      toast.success("OTP sent to your phone");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error("Session expired. Please register again.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    if (isVerifying) return;

    try {
      setIsVerifying(true);
      await verifyOtp(phoneNumber, otp);

      toast.success("Phone number verified");
      router.push("/verify-email");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleVerifyOtp}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Verify phone number</h1>
            <FieldDescription>
              OTP will be sent to {phoneNumber || "your phone number"}
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              OTP
            </FieldLabel>

            <InputOTP
              id="otp"
              maxLength={6}
              value={otp}
              onChange={setOtp}
              containerClassName="gap-4"
            >
              <InputOTPGroup className="gap-2.5 *:h-16 *:w-12 *:rounded-md *:border *:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>

              <InputOTPSeparator />

              <InputOTPGroup className="gap-2.5 *:h-16 *:w-12 *:rounded-md *:border *:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>

          <FieldGroup className="flex flex-row gap-2">
            <Button
              type="button"
              onClick={handleSendOtp}
              disabled={isSending}
              className="w-1/2"
            >
              {isSending ? <Spinner /> : "Send OTP"}
            </Button>

            <Button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className="w-1/2"
            >
              {isVerifying ? <Spinner /> : "Verify"}
            </Button>
          </FieldGroup>
        </FieldGroup>
      </form>
    </div>
  );
}
