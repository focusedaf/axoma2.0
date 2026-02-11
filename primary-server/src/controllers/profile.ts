import { Response } from "express";
import prisma from "../db/db";
import { AuthenticatedRequest } from "../middleware/auth";
import {
  setupStudentProfileSchema,
  editStudentProfileSchema,
  setupProfessorProfileSchema,
  editProfessorProfileSchema,
} from "../zod/zod";


export const setupStudentProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (req.user?.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const studentId = req.user.userId;

    const validation = setupStudentProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.issues,
      });
    }

    const existingProfile = await prisma.studentProfile.findUnique({
      where: { studentID: studentId },
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const profile = await prisma.studentProfile.create({
      data: {
        ...validation.data,
        studentID: studentId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Student profile created",
      data: profile,
    });
  } catch (error) {
    console.error("Setup student profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const editStudentProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (req.user?.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const studentId = req.user.userId;

    const validation = editStudentProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.issues,
      });
    }

    if (Object.keys(validation.data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    const profile = await prisma.studentProfile.update({
      where: { studentID: studentId },
      data: validation.data,
    });

    res.status(200).json({
      success: true,
      message: "Student profile updated",
      data: profile,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    console.error("Edit student profile error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getStudentProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (req.user?.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const studentId = req.user.userId;

    const profile = await prisma.studentProfile.findUnique({
      where: { studentID: studentId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get student profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const setupProfessorProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (req.user?.role !== "professor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const professorId = req.user.userId;

    const validation = setupProfessorProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.issues,
      });
    }

    const existingProfile = await prisma.professorProfile.findUnique({
      where: { professorID: professorId },
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const profile = await prisma.professorProfile.create({
      data: {
        ...validation.data,
        professorID: professorId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Professor profile created",
      data: profile,
    });
  } catch (error) {
    console.error("Setup professor profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const editProfessorProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (req.user?.role !== "professor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const professorId = req.user.userId;

    const validation = editProfessorProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.issues,
      });
    }

    if (Object.keys(validation.data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    const profile = await prisma.professorProfile.update({
      where: { professorID: professorId },
      data: validation.data,
    });

    res.status(200).json({
      success: true,
      message: "Professor profile updated",
      data: profile,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    console.error("Edit professor profile error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProfessorProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (req.user?.role !== "professor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const professorId = req.user.userId;

    const profile = await prisma.professorProfile.findUnique({
      where: { professorID: professorId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get professor profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
