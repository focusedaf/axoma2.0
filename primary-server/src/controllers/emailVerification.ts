import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import prisma from "../db/db";
import {
  sendVerificationEmailSchema,
  verifyEmailTokenSchema,
} from "../zod/zod";
import sendgridConfig from "../config/sendgrid/config";

sgMail.setApiKey(sendgridConfig.apiKey);

export const sendVerificationEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = sendVerificationEmailSchema.parse(req.body);

    // Check student first
    let user = await prisma.students.findUnique({
      where: { email },
      select: { id: true, firstName: true, isEmailVerified: true },
    });

    let userType: "student" | "professor" | null = user ? "student" : null;

    // If not student, check professor
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

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(
      Date.now() + sendgridConfig.verificationTokenExpiry * 60 * 60 * 1000,
    );

    // Update user
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

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    // Email content
    const msg = {
      to: email,
      from: {
        email: sendgridConfig.fromEmail,
        name: sendgridConfig.fromName,
      },
      subject: "Verify Your Email Address",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { 
                display: inline-block; 
                padding: 12px 30px; 
                background-color: #4F46E5; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0;
              }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Welcome to Axoma, ${user.firstName}!</h2>
              <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
              <p>
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #666; word-break: break-all;">${verificationLink}</p>
              <p>This link will expire in ${sendgridConfig.verificationTokenExpiry} hours.</p>
              <div class="footer">
                <p>If you didn't create an account, please ignore this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Welcome to Axoma, ${user.firstName}!
        
        Thank you for signing up. Please verify your email address by clicking the link below:
        
        ${verificationLink}
        
        This link will expire in ${sendgridConfig.verificationTokenExpiry} hours.
        
        If you didn't create an account, please ignore this email.
      `,
    };

    // Send email
    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
      data: {
        email,
        expiresIn: `${sendgridConfig.verificationTokenExpiry} hours`,
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
    const { token } = verifyEmailTokenSchema.parse(req.query);

    // Check student first
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

    // If not student, check professor
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

    // Update user
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
  try {
    const { email } = sendVerificationEmailSchema.parse(req.body);

    // Check student first
    let user = await prisma.students.findUnique({
      where: { email },
      select: { id: true, isEmailVerified: true },
    });

    // If not student, check professor
    if (!user) {
      user = await prisma.professors.findUnique({
        where: { email },
        select: { id: true, isEmailVerified: true },
      });
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

    await sendVerificationEmail(req, res);
  } catch (error: any) {
    console.error("Resend Verification Email Error:", error);

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
      message: error.message || "Failed to resend verification email",
    });
  }
};
