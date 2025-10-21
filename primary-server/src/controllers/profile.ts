import { Request, Response } from "express";
import prisma from "../db/db";
import { setupProfileSchema } from "../zod/zod";
import { verifyAccessToken } from "../utils/token";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;

const studentPartialSchema = setupProfileSchema.options[0].partial();
const professorPartialSchema = setupProfileSchema.options[1].partial();

export const setupStudentProfile = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No auth token found" });

    const decoded = verifyAccessToken(token, accessTokenSecret) as any;
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Token invalid or expired" });

    const studentId = decoded.id || decoded.studentId;

    const student = await prisma.students.findUnique({
      where: { id: studentId },
    });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

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
    if (existingProfile)
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
  } catch (error) {
    console.error("Student profile onboarding couldn't be completed", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const setupProfessorProfile = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No auth token found" });

    const decoded = verifyAccessToken(token, accessTokenSecret) as any;
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Token invalid or expired" });

    const professorId = decoded.id || decoded.professorId;

    const professor = await prisma.professors.findUnique({
      where: { id: professorId },
    });
    if (!professor)
      return res
        .status(404)
        .json({ success: false, message: "Professor not found" });

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
    if (existingProfile)
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
  } catch (error) {
    console.error("Professor onboarding couldn't be completed", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const editStudentProfile = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No auth token found" });

    const decoded = verifyAccessToken(token, accessTokenSecret) as any;
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Token invalid or expired" });

    const studentId = decoded.id || decoded.studentId;

    const validation = studentPartialSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues,
      });
    }

    const updatedProfile = await prisma.studentProfile.update({
      where: { studentID: studentId },
      data: validation.data,
    });

    res.status(200).json({
      success: true,
      message: "Student profile updated",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Couldn't edit student profile", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const editProfessorProfile = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No auth token found" });

    const decoded = verifyAccessToken(token, accessTokenSecret) as any;
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Token invalid or expired" });

    const professorId = decoded.id || decoded.professorId;

    const validation = professorPartialSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues,
      });
    }

    const updatedProfile = await prisma.professorProfile.update({
      where: { professorID: professorId },
      data: validation.data,
    });

    res.status(200).json({
      success: true,
      message: "Professor profile updated",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Couldn't edit professor profile", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No auth token found" });

    const decoded = verifyAccessToken(token, accessTokenSecret) as any;
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Token invalid or expired" });

    const studentId = decoded.id || decoded.studentId;

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
  } catch (error) {
    console.error("Student profile couldn't be fetched", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProfessorProfile = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No auth token found" });

    const decoded = verifyAccessToken(token, accessTokenSecret) as any;
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Token invalid or expired" });

    const professorId = decoded.id || decoded.professorId;

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
  } catch (error) {
    console.error("Professor profile couldn't be fetched", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
