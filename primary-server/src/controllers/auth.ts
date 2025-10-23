import { Request, Response } from "express";
import prisma from "../db/db";
import { newUser, loginSchema } from "../zod/zod";
import {
  hashPassword,
  verifyPassword,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashRefreshToken,
  rotateTokens,
} from "../utils/token";

export const studentRegistration = async (req: Request, res: Response) => {
  try {
    const validation = newUser.safeParse(req.body);
    if (!validation.success)
      return res
        .status(400)
        .json({ success: false, message: "Validation failed" });

    const {
      firstName,
      lastName,
      middleName,
      mobileNumber,
      email,
      password,
      walletAddress,
    } = validation.data;

    const existingStudent = await prisma.students.findUnique({
      where: { email },
    });
    if (existingStudent)
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });

    const existingWallet = await prisma.students.findUnique({
      where: { walletAddress },
    });
    if (existingWallet)
      return res
        .status(409)
        .json({ success: false, message: "Wallet address already in use" });

    const hashedPwd = await hashPassword(password);

    const student = await prisma.students.create({
      data: {
        firstName,
        lastName,
        middleName,
        mobileNumber,
        email,
        password: hashedPwd,
        walletAddress,
        isVerified: false,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: {
        id: student.id,
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        email: student.email,
        mobileNumber: student.mobileNumber,
        walletAddress: student.walletAddress,
        isVerified: student.isVerified,
        role: "student",
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      },
    });
  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const professorRegistration = async (req: Request, res: Response) => {
  try {
    const validation = newUser.safeParse(req.body);
    if (!validation.success)
      return res
        .status(400)
        .json({ success: false, message: "Validation failed" });

    const {
      firstName,
      lastName,
      mobileNumber,
      email,
      password,
      walletAddress,
    } = validation.data;

    const existingProfessor = await prisma.professors.findUnique({
      where: { email },
    });
    if (existingProfessor)
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });

    const existingWallet = await prisma.professors.findUnique({
      where: { walletAddress },
    });
    if (existingWallet)
      return res
        .status(409)
        .json({ success: false, message: "Wallet address already in use" });

    const hashedPwd = await hashPassword(password);

    const professor = await prisma.professors.create({
      data: {
        firstName,
        lastName,
        mobileNumber,
        email,
        password: hashedPwd,
        walletAddress,
        isVerified: false,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Professor registered successfully",
      professor: {
        id: professor.id,
        firstName: professor.firstName,
        lastName: professor.lastName,
        email: professor.email,
        mobileNumber: professor.mobileNumber,
        walletAddress: professor.walletAddress,
        isVerified: professor.isVerified,
        role: "professor",
        createdAt: professor.createdAt,
        updatedAt: professor.updatedAt,
      },
    });
  } catch (error) {
    console.error("Professor registration error:", error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success)
      return res
        .status(400)
        .json({ success: false, message: "Validation failed" });

    const { email, password } = validation.data;
    const student = await prisma.students.findUnique({ where: { email } });
    if (!student)
      return res
        .status(401)
        .json({ success: false, message: "Student not registered" });

    const isValidPwd = await verifyPassword(password, student.password);
    if (!isValidPwd)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const accessToken = createAccessToken(
      { userId: student.id, role: "student" },
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.ACCESS_TOKEN_EXPIRY!
    );
    const refreshToken = createRefreshToken(
      { userId: student.id, role: "student" },
      process.env.REFRESH_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_EXPIRY!
    );
    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    await prisma.students.update({
      where: { id: student.id },
      data: { refreshToken: hashedRefreshToken },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "Student logged in successfully",
        user: {
          id: student.id,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          role: "student",
        },
      });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const professorLogin = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success)
      return res
        .status(400)
        .json({ success: false, message: "Validation failed" });

    const { email, password } = validation.data;
    const professor = await prisma.professors.findUnique({ where: { email } });
    if (!professor)
      return res
        .status(401)
        .json({ success: false, message: "Professor not registered" });

    const isValidPwd = await verifyPassword(password, professor.password);
    if (!isValidPwd)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const accessToken = createAccessToken(
      { userId: professor.id, role: "professor" },
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.ACCESS_TOKEN_EXPIRY!
    );
    const refreshToken = createRefreshToken(
      { userId: professor.id, role: "professor" },
      process.env.REFRESH_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_EXPIRY!
    );
    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    await prisma.professors.update({
      where: { id: professor.id },
      data: { refreshToken: hashedRefreshToken },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "Professor logged in successfully",
        user: {
          id: professor.id,
          email: professor.email,
          firstName: professor.firstName,
          lastName: professor.lastName,
          role: "professor",
        },
      });
  } catch (error) {
    console.error("Professor login error:", error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};


export const me = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const decoded = verifyAccessToken(token, process.env.ACCESS_TOKEN_SECRET!);
    if (!decoded)
      return res.status(401).json({ success: false, message: "Invalid token" });

    const { userId, role } = decoded as {
      userId: string;
      role: "student" | "professor";
    };

    let user;
    if (role === "student") {
      user = await prisma.students.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          mobileNumber: true,
          email: true,
          walletAddress: true,
        },
      });
    } else {
      user = await prisma.professors.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          mobileNumber: true,
          email: true,
          walletAddress: true,
        },
      });
    }

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user: { ...user, role } });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "No refresh token found" });
    }

    const hashedToken = await hashRefreshToken(refreshToken);
    const student = await prisma.students.findUnique({
      where: { refreshToken: hashedToken },
    });
    if (student) {
      await prisma.students.update({
        where: { id: student.id },
        data: { refreshToken: null },
      });
    } else {
      const professor = await prisma.professors.findUnique({
        where: { refreshToken: hashedToken },
      });
      if (professor) {
        await prisma.professors.update({
          where: { id: professor.id },
          data: { refreshToken: null },
        });
      }
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    return res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const { userId, role } = decoded as {
      userId: string;
      role: "student" | "professor";
    };

    const user =
      role === "student"
        ? await prisma.students.findUnique({ where: { id: userId } })
        : await prisma.professors.findUnique({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "User not found or no refresh token stored",
      });
    }

    const isValid = await verifyPassword(refreshToken, user.refreshToken);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = rotateTokens(
      { userId: user.id, role },
      { userId: user.id, role },
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_SECRET!
    );

    const hashedNewRefreshToken = await hashRefreshToken(newRefreshToken);

    if (role === "student") {
      await prisma.students.update({
        where: { id: userId },
        data: { refreshToken: hashedNewRefreshToken },
      });
    } else {
      await prisma.professors.update({
        where: { id: userId },
        data: { refreshToken: hashedNewRefreshToken },
      });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? ("none" as const)
          : ("lax" as const),
      path: "/",
    };

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .status(200)
      .json({ success: true, message: "Tokens refreshed successfully" });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(500)
      .json({ success: false, message: (error as Error).message });
  }
};
