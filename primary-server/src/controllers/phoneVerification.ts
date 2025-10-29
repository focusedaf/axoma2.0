import { Request, Response } from "express";
import twilio from "twilio";
import { db } from "../db/db";
import { sendPhoneOTPSchema, verifyPhoneOTPSchema } from "../zod/zod";
import twilioConfig from "../config/twilio/config";

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);


export const sendPhoneOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { phoneNumber } = sendPhoneOTPSchema.parse(req.body);

    const studentResult = await db.query(
      `SELECT id FROM "Students" WHERE "mobileNumber" = $1`,
      [phoneNumber]
    );

    const professorResult = await db.query(
      `SELECT id FROM "Professors" WHERE "mobileNumber" = $1`,
      [phoneNumber]
    );

    if (studentResult.rows.length === 0 && professorResult.rows.length === 0) {
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

    const studentUpdate = await db.query(
      `UPDATE "Students" 
       SET "isPhoneVerified" = true, "updatedAt" = NOW()
       WHERE "mobileNumber" = $1
       RETURNING id, email, "firstName", "lastName"`,
      [phoneNumber]
    );

    if (studentUpdate.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Phone number verified successfully",
        data: {
          phoneNumber: formattedPhone,
          verified: true,
          user: studentUpdate.rows[0],
        },
      });
      return;
    }

    const professorUpdate = await db.query(
      `UPDATE "Professors" 
       SET "isPhoneVerified" = true, "updatedAt" = NOW()
       WHERE "mobileNumber" = $1
       RETURNING id, email, "firstName", "lastName"`,
      [phoneNumber]
    );

    if (professorUpdate.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Phone number verified successfully",
        data: {
          phoneNumber: formattedPhone,
          verified: true,
          user: professorUpdate.rows[0],
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
