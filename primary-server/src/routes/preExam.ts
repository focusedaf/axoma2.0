import express, { Response, NextFunction } from "express";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import { upload } from "../utils/cloudinaryUpload";
// import { uploadPreExamImage } from "../controllers/preExam";

const UploadRouter = express.Router();

UploadRouter.post(
  "/preExamSetup",
  authMiddleware,
  upload.single("image"), // matches formData.append("image", blob)
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // await uploadPreExamImage(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default UploadRouter;
