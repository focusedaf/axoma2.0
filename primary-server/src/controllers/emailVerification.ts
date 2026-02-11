import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../db/db";
import { resend } from "../config/resend/config";
import resendConfig from "../config/resend/config";
import {
  sendVerificationEmailSchema,
  verifyEmailTokenSchema,
} from "../zod/zod";


export const sendVerificationEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = sendVerificationEmailSchema.parse(req.body);

    let user = await prisma.students.findUnique({
      where: { email },
      select: { id: true, firstName: true, isEmailVerified: true },
    });

    let userType: "student" | "professor" | null = user ? "student" : null;

    if (!user) {
      const professor = await prisma.professors.findUnique({
        where: { email },
        select: { id: true, firstName: true, isEmailVerified: true },
      });

      if (professor) {
        user = professor;
        userType = "professor";
      }
    }

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({
        success: false,
        message: "Email already verified",
      });
      return;
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const tokenExpiry = new Date(
      Date.now() + resendConfig.verificationTokenExpiry * 60 * 60 * 1000,
    );

    if (userType === "student") {
      await prisma.students.update({
        where: { id: user.id },
        data: {
          verificationToken,
          verificationTokenExpiry: tokenExpiry,
        },
      });
    } else {
      await prisma.professors.update({
        where: { id: user.id },
        data: {
          verificationToken,
          verificationTokenExpiry: tokenExpiry,
        },
      });
    }

    const verificationLink = `${process.env.CLIENT_URL}/verify-email/callback?token=${verificationToken}`;

    const { error } = await resend.emails.send({
      from: `${resendConfig.fromName} <${resendConfig.fromEmail}>`,
      to: email,
      subject: "Verify Your Email Address - Axoma",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2>Hi ${user.firstName}! 👋</h2>
          <p>Thanks for signing up for Axoma.</p>
          <p>Please verify your email address by clicking below:</p>
          <a href="${verificationLink}" 
             style="display:inline-block;padding:12px 24px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;">
             Verify Email
          </a>
          <p style="margin-top:20px;font-size:14px;color:#666;">
            This link will expire in ${resendConfig.verificationTokenExpiry} hours.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send verification email",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
      data: {
        email,
        expiresIn: `${resendConfig.verificationTokenExpiry} hours`,
      },
    });
  } catch (error: any) {
    console.error("Send Verification Email Error:", error);

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
      message: error.message || "Failed to send verification email",
    });
  }
};


export const verifyEmailToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
   const { token } = verifyEmailTokenSchema.parse(req.body);
    
    let user = await prisma.students.findUnique({
      where: { verificationToken: token },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        verificationTokenExpiry: true,
      },
    });

    let userType: "student" | "professor" | null = user ? "student" : null;

    if (!user) {
      const professor = await prisma.professors.findUnique({
        where: { verificationToken: token },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          verificationTokenExpiry: true,
        },
      });

      if (professor) {
        user = professor;
        userType = "professor";
      }
    }

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
      return;
    }

    if (new Date() > new Date(user.verificationTokenExpiry!)) {
      res.status(400).json({
        success: false,
        message: "Verification token has expired",
      });
      return;
    }

    if (userType === "student") {
      await prisma.students.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });
    } else {
      await prisma.professors.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        verified: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });
  } catch (error: any) {
    console.error("Verify Email Token Error:", error);

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
      message: error.message || "Failed to verify email",
    });
  }
};


export const resendVerificationEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  await sendVerificationEmail(req, res);
};
