import dotenv from "dotenv";
dotenv.config();

interface SendGridConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  verificationTokenExpiry: number; 
}

const sendgridConfig: SendGridConfig = {
  apiKey: process.env.SENDGRID_API_KEY || "",
  fromEmail: process.env.SENDGRID_FROM_EMAIL || "",
  fromName: process.env.SENDGRID_FROM_NAME || "Axoma",
  verificationTokenExpiry: 24, 
};

export default sendgridConfig;
