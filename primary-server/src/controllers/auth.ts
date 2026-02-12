import { Request, Response } from "express";
import prisma from "../db/db";
import {
  hashPassword,
  verifyPassword,
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../utils/token";
import { newUser, loginSchema } from "../zod/zod";
import { AuthenticatedRequest } from "../middleware/auth";
import { CookieOptions } from "express";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const setTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, cookieOptions);
};

export const studentRegistration = async (req: Request, res: Response) => {
  try {
    const validatedData = newUser.parse(req.body);

    if (validatedData.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "Invalid role for student registration",
      });
    }

    const existingUser = await prisma.students.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { mobileNumber: validatedData.mobileNumber },
          { walletAddress: validatedData.walletAddress },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email, mobile, or wallet",
      });
    }

    const hashedPassword = await hashPassword(validatedData.password);
    const userId = crypto.randomUUID();
    const accessPayload: AccessTokenPayload = { userId, role: "student" };
    const refreshPayload: RefreshTokenPayload = { userId, role: "student" };

    const accessToken = createAccessToken(
      accessPayload,
      ACCESS_TOKEN_SECRET,
      "15m",
    );
    const refreshToken = createRefreshToken(
      refreshPayload,
      REFRESH_TOKEN_SECRET,
      "7d",
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    const result = await prisma.$transaction(async (tx: any) => {
      const student = await tx.students.create({
        data: {
          id: userId,
          email: validatedData.email,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          mobileNumber: validatedData.mobileNumber,
          password: hashedPassword,
          walletAddress: validatedData.walletAddress,
          refreshToken: hashedRefreshToken,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          mobileNumber: true,
          walletAddress: true,
          isVerified: true,
          createdAt: true,
        },
      });

      await tx.roleMap.create({
        data: {
          userId,
          role: "student",
        },
      });

      return student;
    });

    setTokenCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        user: result,
        accessToken,
      },
    });
  } catch (error: any) {
    console.error("Student registration error:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const professorRegistration = async (req: Request, res: Response) => {
  try {
    const validatedData = newUser.parse(req.body);

    if (validatedData.role !== "professor") {
      return res.status(400).json({
        success: false,
        message: "Invalid role for professor registration",
      });
    }

    const existingUser = await prisma.professors.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { mobileNumber: validatedData.mobileNumber },
          { walletAddress: validatedData.walletAddress },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email, mobile, or wallet",
      });
    }

    const hashedPassword = await hashPassword(validatedData.password);
    const userId = crypto.randomUUID();
    const accessPayload: AccessTokenPayload = { userId, role: "professor" };
    const refreshPayload: RefreshTokenPayload = { userId, role: "professor" };

    const accessToken = createAccessToken(
      accessPayload,
      ACCESS_TOKEN_SECRET,
      "15m",
    );
    const refreshToken = createRefreshToken(
      refreshPayload,
      REFRESH_TOKEN_SECRET,
      "7d",
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    const result = await prisma.$transaction(async (tx: any) => {
      const professor = await tx.professors.create({
        data: {
          id: userId,
          email: validatedData.email,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          mobileNumber: validatedData.mobileNumber,
          password: hashedPassword,
          walletAddress: validatedData.walletAddress,
          refreshToken: hashedRefreshToken,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          mobileNumber: true,
          walletAddress: true,
          isVerified: true,
          createdAt: true,
        },
      });

      await tx.roleMap.create({
        data: {
          userId,
          role: "professor",
        },
      });

      return professor;
    });

    setTokenCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      message: "Professor registered successfully",
      data: {
        user: result,
        accessToken,
      },
    });
  } catch (error: any) {
    console.error("Professor registration error:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.students.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        mobileNumber: true,
        password: true,
        walletAddress: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessPayload: AccessTokenPayload = {
      userId: user.id,
      role: "student",
    };
    const refreshPayload: RefreshTokenPayload = {
      userId: user.id,
      role: "student",
    };

    const accessToken = createAccessToken(
      accessPayload,
      ACCESS_TOKEN_SECRET,
      "15m",
    );
    const refreshToken = createRefreshToken(
      refreshPayload,
      REFRESH_TOKEN_SECRET,
      "7d",
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    await prisma.students.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    setTokenCookies(res, accessToken, refreshToken);

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        accessToken,
      },
    });
  } catch (error: any) {
    console.error("Student login error:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const professorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.professors.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        mobileNumber: true,
        password: true,
        walletAddress: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessPayload: AccessTokenPayload = {
      userId: user.id,
      role: "professor",
    };
    const refreshPayload: RefreshTokenPayload = {
      userId: user.id,
      role: "professor",
    };

    const accessToken = createAccessToken(
      accessPayload,
      ACCESS_TOKEN_SECRET,
      "15m",
    );
    const refreshToken = createRefreshToken(
      refreshPayload,
      REFRESH_TOKEN_SECRET,
      "7d",
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    await prisma.professors.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    setTokenCookies(res, accessToken, refreshToken);

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        accessToken,
      },
    });
  } catch (error: any) {
    console.error("Professor login error:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user.userId,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role,
        },
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = verifyRefreshToken(refreshToken, REFRESH_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const { userId, role } = decoded as RefreshTokenPayload;

    const user =
      role === "student"
        ? await prisma.students.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              refreshToken: true,
            },
          })
        : await prisma.professors.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              refreshToken: true,
            },
          });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isValidRefreshToken = await verifyPassword(
      refreshToken,
      user.refreshToken!,
    );

    if (!isValidRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const accessPayload: AccessTokenPayload = { userId, role };
    const refreshPayload: RefreshTokenPayload = { userId, role };

    const newAccessToken = createAccessToken(
      accessPayload,
      ACCESS_TOKEN_SECRET,
      "15m",
    );
    const newRefreshToken = createRefreshToken(
      refreshPayload,
      REFRESH_TOKEN_SECRET,
      "7d",
    );

    const hashedRefreshToken = await hashRefreshToken(newRefreshToken);

    // Update refresh token
    if (role === "student") {
      await prisma.students.update({
        where: { id: userId },
        data: { refreshToken: hashedRefreshToken },
      });
    } else {
      await prisma.professors.update({
        where: { id: userId },
        data: { refreshToken: hashedRefreshToken },
      });
    }

    setTokenCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken, REFRESH_TOKEN_SECRET);

      if (decoded) {
        const { userId, role } = decoded as RefreshTokenPayload;

        // Clear refresh token
        if (role === "student") {
          await prisma.students.update({
            where: { id: userId },
            data: { refreshToken: null },
          });
        } else {
          await prisma.professors.update({
            where: { id: userId },
            data: { refreshToken: null },
          });
        }
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
