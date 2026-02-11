import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

interface ResendConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  verificationTokenExpiry: number;
}

const resendConfig: ResendConfig = {
  apiKey: process.env.RESEND_API_KEY || "",
  fromEmail: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
  fromName: process.env.RESEND_FROM_NAME || "Axoma",
  verificationTokenExpiry: 24, 
};


if (!resendConfig.apiKey) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

export const resend = new Resend(resendConfig.apiKey);

export default resendConfig;
