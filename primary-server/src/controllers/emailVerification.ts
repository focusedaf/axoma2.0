import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { db } from "../db/db";
import {
  sendVerificationEmailSchema,
  verifyEmailTokenSchema,
} from "../zod/zod";
import sendgridConfig from "../config/sendgrid/config";


sgMail.setApiKey(sendgridConfig.apiKey);

export const sendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = sendVerificationEmailSchema.parse(req.body);

    const studentResult = await db.query(
      `SELECT id, "firstName", "isEmailVerified" FROM "Students" WHERE email = $1`,
      [email]
    );

    const professorResult = await db.query(
      `SELECT id, "firstName", "isEmailVerified" FROM "Professors" WHERE email = $1`,
      [email]
    );

    let user = null;
    let userTable = "";

    if (studentResult.rows.length > 0) {
      user = studentResult.rows[0];
      userTable = "Students";
    } else if (professorResult.rows.length > 0) {
      user = professorResult.rows[0];
      userTable = "Professors";
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
      Date.now() + sendgridConfig.verificationTokenExpiry * 60 * 60 * 1000
    );

    await db.query(
      `UPDATE "${userTable}" 
       SET "verificationToken" = $1, 
           "verificationTokenExpiry" = $2,
           "updatedAt" = NOW()
       WHERE id = $3`,
      [verificationToken, tokenExpiry, user.id]
    );

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
  res: Response
): Promise<void> => {
  try {
    const { token } = verifyEmailTokenSchema.parse(req.query);

    const studentResult = await db.query(
      `SELECT id, email, "firstName", "lastName", "verificationTokenExpiry"
       FROM "Students" 
       WHERE "verificationToken" = $1`,
      [token]
    );

    let user = null;
    let userTable = "";

    if (studentResult.rows.length > 0) {
      user = studentResult.rows[0];
      userTable = "Students";
    } else {
      const professorResult = await db.query(
        `SELECT id, email, "firstName", "lastName", "verificationTokenExpiry"
         FROM "Professors" 
         WHERE "verificationToken" = $1`,
        [token]
      );

      if (professorResult.rows.length > 0) {
        user = professorResult.rows[0];
        userTable = "Professors";
      }
    }

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
      return;
    }

    if (new Date() > new Date(user.verificationTokenExpiry)) {
      res.status(400).json({
        success: false,
        message: "Verification token has expired",
      });
      return;
    }

    await db.query(
      `UPDATE "${userTable}" 
       SET "isEmailVerified" = true,
           "verificationToken" = NULL,
           "verificationTokenExpiry" = NULL,
           "updatedAt" = NOW()
       WHERE id = $1`,
      [user.id]
    );

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
  res: Response
): Promise<void> => {
  try {
    const { email } = sendVerificationEmailSchema.parse(req.body);

    const studentResult = await db.query(
      `SELECT id, "isEmailVerified" FROM "Students" WHERE email = $1`,
      [email]
    );

    const professorResult = await db.query(
      `SELECT id, "isEmailVerified" FROM "Professors" WHERE email = $1`,
      [email]
    );

    let user = null;

    if (studentResult.rows.length > 0) {
      user = studentResult.rows[0];
    } else if (professorResult.rows.length > 0) {
      user = professorResult.rows[0];
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
