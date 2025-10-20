import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

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


app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Axoma 2.0 backend is live " });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
