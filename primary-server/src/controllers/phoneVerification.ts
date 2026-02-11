import { Request, Response } from "express";
import twilio from "twilio";
import prisma from "../db/db";
import { sendPhoneOTPSchema, verifyPhoneOTPSchema } from "../zod/zod";
import twilioConfig from "../config/twilio/config";

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

export const sendPhoneOTP = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { phoneNumber } = sendPhoneOTPSchema.parse(req.body);

    // Check if phone number exists in either table
    const student = await prisma.students.findUnique({
      where: { mobileNumber: phoneNumber },
      select: { id: true },
    });

    const professor = await prisma.professors.findUnique({
      where: { mobileNumber: phoneNumber },
      select: { id: true },
    });

    if (!student && !professor) {
      res.status(404).json({
        success: false,
        message: "Phone number not registered",
      });
      return;
    }

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

    if (error.name === "ZodError") {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
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
  res: Response,
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

    if (verificationCheck.status !== "approved") {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
        data: {
          status: verificationCheck.status,
        },
      });
      return;
    }

    // Try updating student first
    const studentUpdate = await prisma.students.updateMany({
      where: { mobileNumber: phoneNumber },
      data: { isPhoneVerified: true },
    });

    if (studentUpdate.count > 0) {
      const user = await prisma.students.findUnique({
        where: { mobileNumber: phoneNumber },
        select: { id: true, email: true, firstName: true, lastName: true },
      });

      res.status(200).json({
        success: true,
        message: "Phone number verified successfully",
        data: {
          phoneNumber: formattedPhone,
          verified: true,
          user,
        },
      });
      return;
    }

    // Try updating professor
    const professorUpdate = await prisma.professors.updateMany({
      where: { mobileNumber: phoneNumber },
      data: { isPhoneVerified: true },
    });

    if (professorUpdate.count > 0) {
      const user = await prisma.professors.findUnique({
        where: { mobileNumber: phoneNumber },
        select: { id: true, email: true, firstName: true, lastName: true },
      });

      res.status(200).json({
        success: true,
        message: "Phone number verified successfully",
        data: {
          phoneNumber: formattedPhone,
          verified: true,
          user,
        },
      });
      return;
    }

    res.status(404).json({
      success: false,
      message: "User not found",
    });
  } catch (error: any) {
    console.error("Verify Phone OTP Error:", error);

    if (error.name === "ZodError") {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify OTP",
    });
  }
};
