import express, { Response, NextFunction } from "express";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import {
  addStudentDocs,
  addProfessorDocs,
  getProfessorDocs,
  getStudentDocs,
} from "../controllers/docVerification";
import { upload } from "../utils/cloudinaryUpload";

const docVerificationRouter = express.Router();

docVerificationRouter.post(
  "/add-docs",
  authMiddleware,
  upload.fields([
    { name: "id_card", maxCount: 1 },
    { name: "fee_receipt", maxCount: 1 },
    { name: "employment_letter", maxCount: 1 },
  ]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role === "student") {
        await addStudentDocs(req, res);
      } else if (req.user?.role === "professor") {
        await addProfessorDocs(req, res);
      } else {
        res.status(400).json({ message: "Invalid user role" });
      }
    } catch (error) {
      next(error);
    }
  },
);

docVerificationRouter.get(
  "/get-docs",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role === "student") {
        await getStudentDocs(req, res);
      } else if (req.user?.role === "professor") {
        await getProfessorDocs(req, res);
      } else {
        res.status(400).json({ message: "Invalid user role" });
      }
    } catch (error) {
      next(error);
    }
  },
);

export default docVerificationRouter;
