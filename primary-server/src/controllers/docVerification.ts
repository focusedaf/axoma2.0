import { Response } from "express";
import { db } from "../db/db";
import { AuthenticatedRequest } from "../middleware/auth";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";


export const addStudentDocs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const studentId = req.user!.userId;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files?.id_card?.[0] && !files?.fee_receipt?.[0]) {
      return res.status(400).json({
        success: false,
        message: "ID card or Fee Receipt file is required",
      });
    }

    const createdDocs = [];

    if (files.id_card?.[0]) {
      const uploadResult = await uploadToCloudinary(
        files.id_card[0].buffer,
        `students/${studentId}/id_card`,
        `id_card_${studentId}_${Date.now()}`
      );

      const result = await db.query(
        `INSERT INTO "StudentDocument" 
        ("studentId", "docType", url, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [studentId, "id_card", uploadResult.url, "pending"]
      );

      createdDocs.push(result.rows[0]);
    }

    if (files.fee_receipt?.[0]) {
      const uploadResult = await uploadToCloudinary(
        files.fee_receipt[0].buffer,
        `students/${studentId}/fee_receipt`,
        `fee_receipt_${studentId}_${Date.now()}`
      );

      const result = await db.query(
        `INSERT INTO "StudentDocument" 
        ("studentId", "docType", url, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [studentId, "fee_receipt", uploadResult.url, "pending"]
      );

      createdDocs.push(result.rows[0]);
    }

    return res.status(201).json({
      success: true,
      message: "Student documents uploaded successfully",
      data: createdDocs,
    });
  } catch (error) {
    console.error("Error adding student docs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getStudentDocs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const studentId = req.user!.userId;

    const result = await db.query(
      `SELECT * FROM "StudentDocument" 
       WHERE "studentId" = $1 
       ORDER BY "createdAt" DESC`,
      [studentId]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching student docs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const addProfessorDocs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const professorId = req.user!.userId;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files?.id_card?.[0] && !files?.employment_letter?.[0]) {
      return res.status(400).json({
        success: false,
        message: "ID card or Employment Letter file is required",
      });
    }

    const createdDocs = [];

    if (files.id_card?.[0]) {
      const uploadResult = await uploadToCloudinary(
        files.id_card[0].buffer,
        `professors/${professorId}/id_card`,
        `id_card_${professorId}_${Date.now()}`
      );

      const result = await db.query(
        `INSERT INTO "ProfessorDocument" 
        ("professorId", "docType", url, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [professorId, "id_card", uploadResult.url, "pending"]
      );

      createdDocs.push(result.rows[0]);
    }

    if (files.employment_letter?.[0]) {
      const uploadResult = await uploadToCloudinary(
        files.employment_letter[0].buffer,
        `professors/${professorId}/employment_letter`,
        `employment_letter_${professorId}_${Date.now()}`
      );

      const result = await db.query(
        `INSERT INTO "ProfessorDocument" 
        ("professorId", "docType", url, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [professorId, "employment_letter", uploadResult.url, "pending"]
      );

      createdDocs.push(result.rows[0]);
    }

    return res.status(201).json({
      success: true,
      message: "Professor documents uploaded successfully",
      data: createdDocs,
    });
  } catch (error) {
    console.error("Error adding professor docs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProfessorDocs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const professorId = req.user!.userId;

    const result = await db.query(
      `SELECT * FROM "ProfessorDocument" 
       WHERE "professorId" = $1 
       ORDER BY "createdAt" DESC`,
      [professorId]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching professor docs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
