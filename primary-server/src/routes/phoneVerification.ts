import express, { Response, NextFunction } from "express";
import { sendPhoneOTP, verifyPhoneOTP } from "../controllers/phoneVerification";

const phoneVerificationRouter = express.Router();

phoneVerificationRouter.post(
  "/send/phone",
  async (req: express.Request, res: Response, next: NextFunction) => {
    try {
      await sendPhoneOTP(req, res);
    } catch (error) {
      next(error);
    }
  }
);

phoneVerificationRouter.post(
  "/verify/phone",
  async (req: express.Request, res: Response, next: NextFunction) => {
    try {
      await verifyPhoneOTP(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default phoneVerificationRouter;
