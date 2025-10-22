import {
  setupStudentProfile,
  setupProfessorProfile,
  editStudentProfile,
  editProfessorProfile,
  getStudentProfile,
  getProfessorProfile,
} from "../controllers/profile";
import express, { Response, NextFunction } from "express";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";

const profileRouter = express.Router();


profileRouter.post(
  "/setup-profile",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role === "student") {
        await setupStudentProfile(req, res);
      } else if (req.user?.role === "professor") {
        await setupProfessorProfile(req, res);
      } else {
        res.status(400).json({ message: "Invalid user role" });
      }
    } catch (error) {
      next(error);
    }
  }
);


profileRouter.put(
  "/edit-profile",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role === "student") {
        await editStudentProfile(req, res);
      } else if (req.user?.role === "professor") {
        await editProfessorProfile(req, res);
      } else {
        res.status(400).json({ message: "Invalid user role" });
      }
    } catch (error) {
      next(error);
    }
  }
);


profileRouter.get(
  "/user-data",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role === "student") {
        await getStudentProfile(req, res);
      } else if (req.user?.role === "professor") {
        await getProfessorProfile(req, res);
      } else {
        res.status(400).json({ message: "Invalid user role" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default profileRouter;
