import { Response } from "express";
import { db } from "../db/db";
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

    // Check if profile already exists
    const existingProfile = await db.query(
      `SELECT id FROM "StudentProfile" WHERE "studentID" = $1`,
      [studentId]
    );

    if (existingProfile.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists",
      });
    }

    // Create profile
    const {
      universityName,
      collegeName,
      majorName,
      currentSem,
      startYear,
      gradYear,
    } = validation.data;

    const result = await db.query(
      `INSERT INTO "StudentProfile" 
      ("universityName", "collegeName", "majorName", "currentSem", "startYear", "gradYear", "studentID")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        universityName,
        collegeName,
        majorName,
        currentSem,
        startYear,
        gradYear,
        studentId,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Student profile created",
      data: result.rows[0],
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

    // Build dynamic update query
    const updates = validation.data;
    const fields = Object.keys(updates).filter((key) => key !== "role");

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    // Build SET clause dynamically
    const setClause = fields
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(", ");

    const values = fields.map(
      (field) => updates[field as keyof typeof updates]
    );
    values.push(studentId);

    const result = await db.query(
      `UPDATE "StudentProfile" 
       SET ${setClause}, "updatedAt" = NOW()
       WHERE "studentID" = $${values.length}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student profile updated",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Edit student profile error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getStudentProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const studentId = req.user!.userId;

    const result = await db.query(
      `SELECT * FROM "StudentProfile" WHERE "studentID" = $1`,
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student profile fetched",
      data: result.rows[0],
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

    // Check if profile already exists
    const existingProfile = await db.query(
      `SELECT id FROM "ProfessorProfile" WHERE "professorID" = $1`,
      [professorId]
    );

    if (existingProfile.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists",
      });
    }

    // Create profile
    const {
      universityName,
      collegeName,
      department,
      designation,
      employmentType,
      joiningYear,
    } = validation.data;

    const result = await db.query(
      `INSERT INTO "ProfessorProfile" 
      ("universityName", "collegeName", department, designation, "employmentType", "joiningYear", "professorID")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        universityName,
        collegeName,
        department,
        designation,
        employmentType,
        joiningYear,
        professorId,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Professor profile created",
      data: result.rows[0],
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

    // Build dynamic update query
    const updates = validation.data;
    const fields = Object.keys(updates).filter((key) => key !== "role");

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    // Build SET clause dynamically
    const setClause = fields
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(", ");

    const values = fields.map(
      (field) => updates[field as keyof typeof updates]
    );
    values.push(professorId);

    const result = await db.query(
      `UPDATE "ProfessorProfile" 
       SET ${setClause}, "updatedAt" = NOW()
       WHERE "professorID" = $${values.length}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Professor profile updated",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Edit professor profile error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProfessorProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const professorId = req.user!.userId;

    const result = await db.query(
      `SELECT * FROM "ProfessorProfile" WHERE "professorID" = $1`,
      [professorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Professor profile fetched",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Get professor profile error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
