import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import connectCloudinary from "../config/cloudinary/config";

connectCloudinary();

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed!"));
    }
  },
});


export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string,
  userId: string,
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
 
    const fileNameWithoutExt = path.parse(file.originalname).name;

    const uniquePublicId = `${userId}_${Date.now()}_${fileNameWithoutExt}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: uniquePublicId,
        resource_type: file.mimetype === "application/pdf" ? "raw" : "image",
        quality: file.mimetype === "application/pdf" ? undefined : "auto",
        fetch_format: file.mimetype === "application/pdf" ? undefined : "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve({
            url: result!.secure_url,
            public_id: result!.public_id,
          });
        }
      },
    );

    uploadStream.end(file.buffer);
  });
};


export const deleteFromCloudinary = async (
  publicId: string,
  isPDF: boolean = false,
) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: isPDF ? "raw" : "image",
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

export default cloudinary;
