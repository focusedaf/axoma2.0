import express, { Response, NextFunction } from "express";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import { upload } from "../utils/cloudinaryUpload";
import { analyzeFrame } from "../controllers/ai";

const AiRouter = express.Router();

AiRouter.post(
  "/analyze-frame",
  authMiddleware,
  upload.single("frame"),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await analyzeFrame(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default AiRouter;
