import { Request, Response } from "express";
import { db } from "../db/db";
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

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const setTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
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

    const existingUser = await db.query(
      'SELECT id FROM "Students" WHERE email = $1 OR "mobileNumber" = $2 OR "walletAddress" = $3',
      [
        validatedData.email,
        validatedData.mobileNumber,
        validatedData.walletAddress,
      ]
    );

    if (existingUser.rows.length > 0) {
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
      "15m"
    );
    const refreshToken = createRefreshToken(
      refreshPayload,
      REFRESH_TOKEN_SECRET,
      "7d"
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `INSERT INTO "Students" 
        (id, email, "firstName", "lastName", "mobileNumber", password, "walletAddress", "refreshToken")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, email, "firstName", "lastName", "mobileNumber", "walletAddress", "isVerified", "createdAt"`,
        [
          userId,
          validatedData.email,
          validatedData.firstName,
          validatedData.lastName,
          validatedData.mobileNumber,
          hashedPassword,
          validatedData.walletAddress,
          hashedRefreshToken,
        ]
      );

      await client.query(
        `INSERT INTO "RoleMap" ("userId", role) VALUES ($1, $2)`,
        [userId, "student"]
      );

      await client.query("COMMIT");

      setTokenCookies(res, accessToken, refreshToken);

      return res.status(201).json({
        success: true,
        message: "Student registered successfully",
        data: {
          user: result.rows[0],
          accessToken,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
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

    const existingUser = await db.query(
      'SELECT id FROM "Professors" WHERE email = $1 OR "mobileNumber" = $2 OR "walletAddress" = $3',
      [
        validatedData.email,
        validatedData.mobileNumber,
        validatedData.walletAddress,
      ]
    );

    if (existingUser.rows.length > 0) {
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
      "15m"
    );
    const refreshToken = createRefreshToken(
      refreshPayload,
      REFRESH_TOKEN_SECRET,
      "7d"
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `INSERT INTO "Professors" 
        (id, email, "firstName", "lastName", "mobileNumber", password, "walletAddress", "refreshToken")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, email, "firstName", "lastName", "mobileNumber", "walletAddress", "isVerified", "createdAt"`,
        [
          userId,
          validatedData.email,
          validatedData.firstName,
          validatedData.lastName,
          validatedData.mobileNumber,
          hashedPassword,
          validatedData.walletAddress,
          hashedRefreshToken,
        ]
      );

      await client.query(
        `INSERT INTO "RoleMap" ("userId", role) VALUES ($1, $2)`,
        [userId, "professor"]
      );

      await client.query("COMMIT");

      setTokenCookies(res, accessToken, refreshToken);

      return res.status(201).json({
        success: true,
        message: "Professor registered successfully",
        data: {
          user: result.rows[0],
          accessToken,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
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

    const result = await db.query(
      `SELECT id, email, "firstName", "lastName", "mobileNumber", password, "walletAddress", "isVerified"
       FROM "Students" WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

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
      "15m"
    );
    const refreshToken = createRefreshToken(
      refreshPayload,
      REFRESH_TOKEN_SECRET,
      "7d"
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);
    await db.query(
      `UPDATE "Students" SET "refreshToken" = $1, "updatedAt" = NOW() WHERE id = $2`,
      [hashedRefreshToken, user.id]
    );

    setTokenCookies(res, accessToken, refreshToken);

    delete user.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
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

    const result = await db.query(
      `SELECT id, email, "firstName", "lastName", "mobileNumber", password, "walletAddress", "isVerified"
       FROM "Professors" WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

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
      "15m"
    );
    const refreshToken = createRefreshToken(
      refreshPayload,
      REFRESH_TOKEN_SECRET,
      "7d"
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);
    await db.query(
      `UPDATE "Professors" SET "refreshToken" = $1, "updatedAt" = NOW() WHERE id = $2`,
      [hashedRefreshToken, user.id]
    );

    setTokenCookies(res, accessToken, refreshToken);

    delete user.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
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
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Me endpoint error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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

    const table = role === "student" ? "Students" : "Professors";
    const result = await db.query(
      `SELECT id, email, "firstName", "lastName", "refreshToken" FROM "${table}" WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    const isValidRefreshToken = await verifyPassword(
      refreshToken,
      user.refreshToken
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
      "15m"
    );
    const newRefreshToken = createRefreshToken(
      refreshPayload,
      REFRESH_TOKEN_SECRET,
      "7d"
    );

    const hashedRefreshToken = await hashRefreshToken(newRefreshToken);
    await db.query(
      `UPDATE "${table}" SET "refreshToken" = $1, "updatedAt" = NOW() WHERE id = $2`,
      [hashedRefreshToken, userId]
    );

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
        const table = role === "student" ? "Students" : "Professors";

        await db.query(
          `UPDATE "${table}" SET "refreshToken" = NULL, "updatedAt" = NOW() WHERE id = $1`,
          [userId]
        );
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
