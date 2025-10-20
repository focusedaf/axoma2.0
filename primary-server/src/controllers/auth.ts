// register,login,logout,me,refreshToken
import express, { Request, Response } from "express";
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

    if (!validation.success) {
      return res
        .status(400)
        .json({ success: false, message: "Validation failed" });
    }

    const {
      firstName,
      lastName,
      mobileNumber,
      role,
      email,
      password,
      walletAddress,
    } = validation.data;

    const existingStudent = await prisma.students.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    const existingWallet = await prisma.students.findUnique({
      where: { walletAddress },
    });

    if (existingWallet) {
      return res.status(409).json({
        success: false,
        message: "Wallet address already in use",
      });
    }
    const hashedPwd = await hashPassword(password);

    const student = await prisma.students.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        role: role,
        email: email,
        password: hashedPwd,
        walletAddress: walletAddress,
        isVerified: false,
      },
    });

    const checkStudent = await prisma.students.findUnique({
      where: { id: student.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        mobileNumber: true,
        role: true,
        email: true,
        walletAddress: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!checkStudent) {
      return res
        .status(500)
        .json({ success: false, message: "Registration Process Failed" });
    } else {
      return res.status(201).json({
        success: true,
        message: "Student registered successfully",
        student: checkStudent,
      });
    }
  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const professorRegistration = async (req: Request, res: Response) => {
  try {
    const validation = newUser.safeParse(req.body);

    if (!validation.success) {
      return res
        .status(400)
        .json({ success: false, message: "Validation failed" });
    }

    const {
      firstName,
      lastName,
      mobileNumber,
      role,
      email,
      password,
      walletAddress,
    } = validation.data;

    const existingProfessor = await prisma.professors.findUnique({
      where: { email },
    });

    if (existingProfessor) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    const existingWallet = await prisma.professors.findUnique({
      where: { walletAddress },
    });

    if (existingWallet) {
      return res.status(409).json({
        success: false,
        message: "Wallet address already in use",
      });
    }
    const hashedPwd = await hashPassword(password);

    const professor = await prisma.professors.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        role: role,
        email: email,
        password: hashedPwd,
        walletAddress: walletAddress,
        isVerified: false,
      },
    });

    const checkProfessor = await prisma.professors.findUnique({
      where: { id: professor.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        mobileNumber: true,
        role: true,
        email: true,
        walletAddress: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!checkProfessor) {
      return res
        .status(500)
        .json({ success: false, message: "Registration Process Failed" });
    } else {
      return res.status(201).json({
        success: true,
        message: "Professor registered successfully",
        professor: checkProfessor,
      });
    }
  } catch (error) {
    console.error("Professor registration error:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res
        .status(400)
        .json({ success: false, message: "validation failed" });
    }

    const { email, password } = validation.data;

    const student = await prisma.students.findUnique({
      where: { email },
    });

    if (!student) {
      return res
        .status(401)
        .json({ success: false, message: "Student not registered" });
    }

    const isValidPwd = await verifyPassword(password, student.password);

    if (!isValidPwd) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessTokenPayload = {
      userId: student.id,
    };

    const refreshTokenPayload = {
      userId: student.id,
    };

    const accessToken = createAccessToken(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.ACCESS_TOKEN_EXPIRY!
    );

    const refreshToken = createRefreshToken(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_EXPIRY!
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    await prisma.users.update({
      where: { id: student.id },
      data: { refreshToken: hashedRefreshToken },
    });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? ("none" as const)
          : ("lax" as const),
      path: "/",
    };

    console.log("accesstoken", accessToken);
    console.log("refreshtoken", refreshToken);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Student logged in successfully",
        user: {
          id: student.id,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
        },
      });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const professorLogin = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res
        .status(400)
        .json({ success: false, message: "validation failed" });
    }

    const { email, password } = validation.data;

    const professor = await prisma.professors.findUnique({ where: { email } });

    if (!professor) {
      return res
        .status(401)
        .json({ success: false, message: "Professor not registered" });
    }

    const isValidPwd = await verifyPassword(password, professor.password);

    if (!isValidPwd) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessTokenPayload = {
      userId: professor.id,
    };

    const refreshTokenPayload = {
      userId: professor.id,
    };

    const accessToken = createAccessToken(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.ACCESS_TOKEN_EXPIRY!
    );

    const refreshToken = createRefreshToken(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_EXPIRY!
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    await prisma.users.update({
      where: { id: professor.id },
      data: { refreshToken: hashedRefreshToken },
    });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? ("none" as const)
          : ("lax" as const),
      path: "/",
    };

    console.log("accesstoken", accessToken);
    console.log("refreshtoken", refreshToken);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Professor logged in successfully",
        user: {
          id: professor.id,
          email: professor.email,
          firstName: professor.firstName,
          lastName: professor.lastName,
        },
      });
  } catch (error) {
    console.error("Professor login error:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
