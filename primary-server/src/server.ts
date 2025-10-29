import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import docVerificationRouter from "./routes/docVerification";
import phoneVerificationRouter from "./routes/phoneVerification";
import AiRouter from "./routes/ai";
import UploadRouter from "./routes/preExam";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// APIs
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/verify-phone", phoneVerificationRouter);
app.use("/api/v1/user", profileRouter);
app.use("/api/v1/verify-docs", docVerificationRouter);
app.use("/api/v1", AiRouter);
app.use("/api/v1/upload", UploadRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Axoma 2.0 backend is live " });
});

app.listen(PORT, () => console.log(`Backend running on :${PORT}`));
