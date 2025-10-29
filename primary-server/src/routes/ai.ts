import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { forwardFrameToAI } from "../controllers/ai";

const aiRouter = express.Router();
const upload = multer(); 

aiRouter.post(
  "/send-frame",
  upload.single("frame"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const frame = req.file;
      const result = await forwardFrameToAI(frame!);
      res.status(200).json({ success: true, result });
    } catch (err: any) {
      console.error("AI Route error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

export default aiRouter;
