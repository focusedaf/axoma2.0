// import { Response } from "express";
// import { AuthenticatedRequest } from "../middleware/auth";
// import { uploadToCloudinary } from "../utils/cloudinaryUpload";

// export const uploadPreExamImage = async (
//   req: AuthenticatedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.user?.userId;

//     if (!userId) {
//       res.status(401).json({
//         success: false,
//         message: "Unauthorized - user not authenticated",
//       });
//       return;
//     }

//     const image = req.file;
//     if (!image) {
//       res.status(400).json({
//         success: false,
//         message: "No image provided",
//       });
//       return;
//     }

//     const result = await uploadToCloudinary(
//       image.buffer,
//       `exam-photos/${userId}`, 
//       `pre-exam-${userId}-${Date.now()}`, 
//       false 
//     );

//     console.log(`Pre-exam image uploaded for user ${userId}:`, {
//       timestamp: new Date().toISOString(),
//       url: result.url,
//       public_id: result.public_id,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Image uploaded successfully",
//       data: {
//         url: result.url,
//         public_id: result.public_id,
//       },
//     });
//   } catch (error: any) {
//     console.error("Image upload error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to upload image",
//     });
//   }
// };
