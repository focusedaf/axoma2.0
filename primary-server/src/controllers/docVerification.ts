import { Response } from "express";
import prisma from "../db/db";
import { AuthenticatedRequest } from "../middleware/auth";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";


export const addStudentDocs = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const studentId = req.user!.userId;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!files?.id_card?.[0] && !files?.fee_receipt?.[0]) {
      return res.status(400).json({
        success: false,
        message: "ID card or Fee Receipt file is required",
      });
    }

    const createdDocs = [];


    if (files.id_card?.[0]) {
      const uploadResult = await uploadToCloudinary(
        files.id_card[0],
        `students/${studentId}`,
        studentId,
      );

      const doc = await prisma.studentDocument.create({
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
        files.fee_receipt[0],
        `students/${studentId}`,
        studentId,
      );

      const doc = await prisma.studentDocument.create({
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
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getStudentDocs = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const studentId = req.user!.userId;

    const docs = await prisma.studentDocument.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: docs,
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
  res: Response,
) => {
  try {
    const professorId = req.user!.userId;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!files?.id_card?.[0] && !files?.employment_letter?.[0]) {
      return res.status(400).json({
        success: false,
        message: "ID card or Employment Letter file is required",
      });
    }

    const createdDocs = [];

   
    if (files.id_card?.[0]) {
      const uploadResult = await uploadToCloudinary(
        files.id_card[0],
        `professors/${professorId}`,
        professorId,
      );

      const doc = await prisma.professorDocument.create({
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
        files.employment_letter[0],
        `professors/${professorId}`,
        professorId,
      );

      const doc = await prisma.professorDocument.create({
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
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProfessorDocs = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const professorId = req.user!.userId;

    const docs = await prisma.professorDocument.findMany({
      where: { professorId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    console.error("Error fetching professor docs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
