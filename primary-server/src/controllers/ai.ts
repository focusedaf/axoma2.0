import { Response } from "express";
import fetch from "node-fetch";
import { FormData, File } from "formdata-node";
import { AuthenticatedRequest } from "../middleware/auth";

// =========================================================
// UTILITY: Forward Frame to AI Server
// =========================================================
const forwardFrameToAI = async (frame: Express.Multer.File) => {
  if (!frame) {
    throw new Error("No frame provided");
  }

  const aiServerUrl = process.env.AI_SERVER_URL;
  if (!aiServerUrl) {
    throw new Error("AI_SERVER_URL not configured in .env");
  }

  const formData = new FormData();
  const file = new File([frame.buffer], "frame.jpg", { type: frame.mimetype });
  formData.set("frame", file);

  try {
    const aiResponse = await fetch(aiServerUrl, {
      method: "POST",
      body: formData as any,
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI server error (${aiResponse.status}): ${errText}`);
    }

    const result = await aiResponse.json();
    return result;
  } catch (error: any) {
    console.error("Error forwarding frame to AI server:", error);
    throw new Error(`Failed to communicate with AI server: ${error.message}`);
  }
};

// =========================================================
// CONTROLLER: Analyze Frame
// =========================================================
export const analyzeFrame = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - user not authenticated",
      });
      return;
    }

    const frame = req.file;
    if (!frame) {
      res.status(400).json({
        success: false,
        message: "No frame provided",
      });
      return;
    }

    const aiResult = await forwardFrameToAI(frame);

    console.log(`Frame analyzed for user ${userId}:`, {
      timestamp: new Date().toISOString(),
      result: aiResult,
    });

    res.status(200).json({
      success: true,
      message: "Frame analyzed successfully",
      data: aiResult,
    });
  } catch (error: any) {
    console.error("AI proctoring error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze frame",
    });
  }
};
