import { Request, Response } from "express";
import prisma from "../db/db";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { verifyAccessToken } from "../utils/token";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;

export const addStudentDocs = async (req: Request, res: Response) => {
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

    const studentId = decoded.id || decoded.userId;

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

      const doc = await prisma.StudentDocument.create({
        data: {
          studentId,
          docType: "id_card",
          url: uploadResult.url,
          status: "pending",
        },
      });
      createdDocs.push(doc);
    }

    if (files.fee_receipt?.[0]) {
      const uploadResult = await uploadToCloudinary(
        files.fee_receipt[0].buffer,
        `students/${studentId}/fee_receipt`,
        `fee_receipt_${studentId}_${Date.now()}`
      );

      const doc = await prisma.StudentDocument.create({
        data: {
          studentId,
          docType: "fee_receipt",
          url: uploadResult.url,
          status: "pending",
        },
      });
      createdDocs.push(doc);
    }

    return res.status(201).json({
      success: true,
      message: "Student documents uploaded successfully",
      data: createdDocs,
    });
  } catch (error) {
    console.error("Error adding student docs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const addProfessorDocs = async (req: Request, res: Response) => {
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

    const professorId = decoded.id || decoded.userId;

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

      const doc = await prisma.ProfessorDocument.create({
        data: {
          professorId,
          docType: "id_card",
          url: uploadResult.url,
          status: "pending",
        },
      });
      createdDocs.push(doc);
    }

    if (files.employment_letter?.[0]) {
      const uploadResult = await uploadToCloudinary(
        files.employment_letter[0].buffer,
        `professors/${professorId}/employment_letter`,
        `employment_letter_${professorId}_${Date.now()}`
      );

      const doc = await prisma.ProfessorDocument.create({
        data: {
          professorId,
          docType: "employment_letter",
          url: uploadResult.url,
          status: "pending",
        },
      });
      createdDocs.push(doc);
    }

    return res.status(201).json({
      success: true,
      message: "Professor documents uploaded successfully",
      data: createdDocs,
    });
  } catch (error) {
    console.error("Error adding professor docs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getStudentDocs = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No auth token found" });

    const decoded = verifyAccessToken(token, accessTokenSecret) as any;
    const studentId = decoded.id || decoded.userId;

    const docs = await prisma.StudentDocument.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, data: docs });
  } catch (error) {
    console.error("Error fetching student docs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getProfessorDocs = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No auth token found" });

    const decoded = verifyAccessToken(token, accessTokenSecret) as any;
    const professorId = decoded.id || decoded.userId;

    const docs = await prisma.ProfessorDocument.findMany({
      where: { professorId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, data: docs });
  } catch (error) {
    console.error("Error fetching professor docs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
