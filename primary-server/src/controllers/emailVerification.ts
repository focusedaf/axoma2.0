// controllers/emailVerification.ts
import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { z } from "zod";
import { emailSchema,sendVerificationEmailSchema,verifyEmailTokenSchema } from "../zod/zod";
import sendgridConfig from "../config/sendgrid/config";


// Initialize SendGrid
sgMail.setApiKey(sendgridConfig.apiKey);


/**
 * Send verification email with link
 * POST /api/email-verification/send
 */
export const sendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = sendVerificationEmailSchema.parse(req.body);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(
      Date.now() + sendgridConfig.verificationTokenExpiry * 60 * 60 * 1000
    );

    // TODO: Save token to database
    // await prisma.user.update({
    //   where: { email },
    //   data: {
    //     verificationToken,
    //     verificationTokenExpiry: tokenExpiry,
    //   },
    // });

    // Create verification link
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
              <h2>Welcome to Axoma!</h2>
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
        Welcome to Axoma!
        
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
      message: error.message || "Failed to send verification email",
    });
  }
};

/**
 * Verify email using token from link
 * GET /api/email-verification/verify?token=xxx
 */
export const verifyEmailToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = verifyEmailTokenSchema.parse(req.query);

    // TODO: Find user by token and check expiry
    // const user = await prisma.user.findFirst({
    //   where: {
    //     verificationToken: token,
    //     verificationTokenExpiry: {
    //       gte: new Date(), // Token not expired
    //     },
    //   },
    // });

    // if (!user) {
    //   res.status(400).json({
    //     success: false,
    //     message: "Invalid or expired verification token",
    //   });
    //   return;
    // }

    // TODO: Update user as verified
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     isVerified: true,
    //     verificationToken: null,
    //     verificationTokenExpiry: null,
    //   },
    // });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        verified: true,
      },
    });
  } catch (error: any) {
    console.error("Verify Email Token Error:", error);

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
      message: error.message || "Failed to verify email",
    });
  }
};

/**
 * Resend verification email
 * POST /api/email-verification/resend
 */
export const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = sendVerificationEmailSchema.parse(req.body);

    // TODO: Check if user exists and is not already verified
    // const user = await prisma.user.findUnique({
    //   where: { email },
    // });

    // if (!user) {
    //   res.status(404).json({
    //     success: false,
    //     message: "User not found",
    //   });
    //   return;
    // }

    // if (user.isVerified) {
    //   res.status(400).json({
    //     success: false,
    //     message: "Email already verified",
    //   });
    //   return;
    // }

    // Reuse the send verification email logic
    await sendVerificationEmail(req, res);
  } catch (error: any) {
    console.error("Resend Verification Email Error:", error);

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
      message: error.message || "Failed to resend verification email",
    });
  }
};
