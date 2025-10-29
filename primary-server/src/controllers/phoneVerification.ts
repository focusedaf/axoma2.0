import { Request, Response } from "express";
import twilio from "twilio";
import twilioConfig from "../config/twilio/config";
import {z} from "zod"
import { emailSchema,mobileSchema,sendEmailOTPSchema,sendPhoneOTPSchema,verifyEmailOTPSchema,verifyPhoneOTPSchema } from "../zod/zod";

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

export const sendPhoneOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { phoneNumber } = sendPhoneOTPSchema.parse(req.body);

    const formattedPhone = `+91${phoneNumber}`;

    const verification = await client.verify.v2
      .services(twilioConfig.verifyServiceSid)
      .verifications.create({
        to: formattedPhone,
        channel: "sms",
      });

    res.status(200).json({
      success: true,
      message: "OTP sent to your phone number",
      data: {
        phoneNumber: formattedPhone,
        status: verification.status,
      },
    });
  } catch (error: any) {
    console.error("Send Phone OTP Error:", error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP",
    });
  }
};



export const verifyPhoneOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { phoneNumber, code } = verifyPhoneOTPSchema.parse(req.body);

    const formattedPhone = `+91${phoneNumber}`;

    const verificationCheck = await client.verify.v2
      .services(twilioConfig.verifyServiceSid)
      .verificationChecks.create({
        to: formattedPhone,
        code: code,
      });

    if (verificationCheck.status === "approved") {
      // TODO: Update user verification status in database
      // Example with Prisma:
      // await prisma.user.update({
      //   where: { mobileNumber: phoneNumber },
      //   data: { isVerified: true }
      // });

      res.status(200).json({
        success: true,
        message: "Phone number verified successfully",
        data: {
          phoneNumber: formattedPhone,
          verified: true,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
        data: {
          status: verificationCheck.status,
        },
      });
    }
  } catch (error: any) {
    console.error("Verify Phone OTP Error:", error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify OTP",
    });
  }
};
