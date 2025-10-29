import express, { Response, NextFunction } from "express";
import {
  sendVerificationEmail,
  verifyEmailToken,
  resendVerificationEmail,
} from "../controllers/emailVerification";

const emailVerificationRouter = express.Router();

emailVerificationRouter.post(
  "/send",
  async (req: express.Request, res: Response, next: NextFunction) => {
    try {
      await sendVerificationEmail(req, res);
    } catch (error) {
      next(error);
    }
  }
);

emailVerificationRouter.get(
  "/verify",
  async (req: express.Request, res: Response, next: NextFunction) => {
    try {
      await verifyEmailToken(req, res);
    } catch (error) {
      next(error);
    }
  }
);

emailVerificationRouter.post(
  "/resend",
  async (req: express.Request, res: Response, next: NextFunction) => {
    try {
      await resendVerificationEmail(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default emailVerificationRouter;
