import express, { Request, Response, NextFunction } from "express";
import {
  studentLogin,
  professorLogin,
  studentRegistration,
  professorRegistration,
  me,
  refreshTokens,
  logoutUser,
} from "../controllers/auth";
import { authMiddleware } from "../middleware/auth";

const authRouter = express.Router();


authRouter.post(
  "/register-student",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await studentRegistration(req, res);
    } catch (error) {
      next(error);
    }
  }
);


authRouter.post(
  "/register-professor",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await professorRegistration(req, res);
    } catch (error) {
      next(error);
    }
  }
);


authRouter.post(
  "/login-student",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await studentLogin(req, res);
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/login-professor",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await professorLogin(req, res);
    } catch (error) {
      next(error);
    }
  }
);


authRouter.get(
  "/me",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await me(req, res);
    } catch (error) {
      next(error);
    }
  }
);


authRouter.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await refreshTokens(req, res);
    } catch (error) {
      next(error);
    }
  }
);


authRouter.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await logoutUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
