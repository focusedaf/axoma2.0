import express from "express";
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

authRouter.post("/register-student", studentRegistration);
authRouter.post("/register-professor", professorRegistration);
authRouter.post("/login-student", studentLogin);
authRouter.post("/login-professor", professorLogin);
authRouter.get("/me", authMiddleware, me);
authRouter.post("/refresh", refreshTokens);
authRouter.post("/logout", logoutUser);

export default authRouter;
