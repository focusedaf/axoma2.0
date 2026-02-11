import { Request, Response, NextFunction } from "express";
import prisma from "../db/db";
import { verifyAccessToken } from "../utils/token";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role: "student" | "professor";
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access token required" });
    }

    const decoded = verifyAccessToken(token, process.env.ACCESS_TOKEN_SECRET!);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const { userId, role } = decoded as {
      userId: string;
      role: "student" | "professor";
    };

    // Query appropriate table based on role
    const user =
      role === "student"
        ? await prisma.students.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          })
        : await prisma.professors.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
};
