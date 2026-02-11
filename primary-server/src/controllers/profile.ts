import { Response } from "express";
import prisma from "../db/db";
import { setupProfileSchema } from "../zod/zod";
import { AuthenticatedRequest } from "../middleware/auth";

const studentPartialSchema = setupProfileSchema.options[0].partial();
const professorPartialSchema = setupProfileSchema.options[1].partial();

export const setupStudentProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const studentId = req.user!.userId;

    const validation = setupProfileSchema.options[0].safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
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

    const {
      universityName,
      collegeName,
      majorName,
      currentSem,
      startYear,
      gradYear,
    } = validation.data;

    const profile = await prisma.studentProfile.create({
      data: {
        universityName,
        collegeName,
        majorName,
        currentSem: parseInt(currentSem),
        startYear: parseInt(startYear),
        gradYear: parseInt(gradYear),
        studentID: studentId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Student profile created",
      data: profile,
    });
  } catch (err) {
    console.error("Setup student profile error:", err);
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
    const studentId = req.user!.userId;

    const validation = studentPartialSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues,
      });
    }

    const updates = validation.data;
    
    const { role, ...dataToUpdate } = updates as any;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    const processedData: any = { ...dataToUpdate };
    if (processedData.currentSem) {
      processedData.currentSem = parseInt(processedData.currentSem);
    }
    if (processedData.startYear) {
      processedData.startYear = parseInt(processedData.startYear);
    }
    if (processedData.gradYear) {
      processedData.gradYear = parseInt(processedData.gradYear);
    }

    const profile = await prisma.studentProfile.update({
      where: { studentID: studentId },
      data: processedData,
    });

    res.status(200).json({
      success: true,
      message: "Student profile updated",
      data: profile,
    });
  } catch (err: any) {
    console.error("Edit student profile error:", err);

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

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
    const studentId = req.user!.userId;

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
      message: "Student profile fetched",
      data: profile,
    });
  } catch (err) {
    console.error("Get student profile error:", err);
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
    const professorId = req.user!.userId;

    const validation = setupProfileSchema.options[1].safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
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

    const {
      universityName,
      collegeName,
      department,
      designation,
      employmentType,
      joiningYear,
    } = validation.data;

    const profile = await prisma.professorProfile.create({
      data: {
        universityName,
        collegeName,
        department,
        designation,
        employmentType,
        joiningYear: parseInt(joiningYear),
        professorID: professorId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Professor profile created",
      data: profile,
    });
  } catch (err) {
    console.error("Setup professor profile error:", err);
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
    const professorId = req.user!.userId;

    const validation = professorPartialSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues,
      });
    }

    const updates = validation.data;
    
    const { role, ...dataToUpdate } = updates as any;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    const processedData: any = { ...dataToUpdate };
    if (processedData.joiningYear) {
      processedData.joiningYear = parseInt(processedData.joiningYear);
    }

    const profile = await prisma.professorProfile.update({
      where: { professorID: professorId },
      data: processedData,
    });

    res.status(200).json({
      success: true,
      message: "Professor profile updated",
      data: profile,
    });
  } catch (err: any) {
    console.error("Edit professor profile error:", err);

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

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
    const professorId = req.user!.userId;

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
      message: "Professor profile fetched",
      data: profile,
    });
  } catch (err) {
    console.error("Get professor profile error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
