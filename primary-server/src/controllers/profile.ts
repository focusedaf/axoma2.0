import { Response } from "express";
import prisma from "../db/db";
import { setupProfileSchema } from "../zod/zod";
import { AuthenticatedRequest } from "../middleware/auth";

const studentPartialSchema = setupProfileSchema.options[0].partial();
const professorPartialSchema = setupProfileSchema.options[1].partial();

export const setupStudentProfile = async (
  req: AuthenticatedRequest,
  res: Response
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

    const existing = await prisma.studentProfile.findUnique({
      where: { studentID: studentId },
    });
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Profile already exists" });

    const profile = await prisma.studentProfile.create({
      data: { ...validation.data, studentID: studentId },
    });

    res.status(201).json({
      success: true,
      message: "Student profile created",
      data: profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const editStudentProfile = async (
  req: AuthenticatedRequest,
  res: Response
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

    const updated = await prisma.studentProfile.update({
      where: { studentID: studentId },
      data: validation.data,
    });

    res.status(200).json({
      success: true,
      message: "Student profile updated",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getStudentProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const studentId = req.user!.userId;

    const profile = await prisma.studentProfile.findUnique({
      where: { studentID: studentId },
    });
    if (!profile)
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });

    res.status(200).json({
      success: true,
      message: "Student profile fetched",
      data: profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const setupProfessorProfile = async (
  req: AuthenticatedRequest,
  res: Response
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

    const existing = await prisma.professorProfile.findUnique({
      where: { professorID: professorId },
    });
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Profile already exists" });

    const profile = await prisma.professorProfile.create({
      data: { ...validation.data, professorID: professorId },
    });

    res.status(201).json({
      success: true,
      message: "Professor profile created",
      data: profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const editProfessorProfile = async (
  req: AuthenticatedRequest,
  res: Response
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

    const updated = await prisma.professorProfile.update({
      where: { professorID: professorId },
      data: validation.data,
    });

    res.status(200).json({
      success: true,
      message: "Professor profile updated",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProfessorProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const professorId = req.user!.userId;

    const profile = await prisma.professorProfile.findUnique({
      where: { professorID: professorId },
    });
    if (!profile)
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });

    res.status(200).json({
      success: true,
      message: "Professor profile fetched",
      data: profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
