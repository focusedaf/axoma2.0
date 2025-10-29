import fetch from "node-fetch";
import { FormData, File } from "formdata-node";

export const forwardFrameToAI = async (frame: Express.Multer.File) => {
  if (!frame) throw new Error("No frame provided");

  const aiServerUrl = process.env.AI_SERVER_URL;
  if (!aiServerUrl) throw new Error("AI_SERVER_URL not configured in .env");

  const formData = new FormData();
  const file = new File([frame.buffer], "frame.jpg", { type: frame.mimetype });
  formData.set("frame", file);

  const aiResponse = await fetch(aiServerUrl, {
    method: "POST",
    body: formData as any,
  });

  if (!aiResponse.ok) {
    const errText = await aiResponse.text();
    throw new Error(`AI server responded with error: ${errText}`);
  }

  const result = await aiResponse.json();
  return result;
};
