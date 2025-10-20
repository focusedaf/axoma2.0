"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const config_1 = __importDefault(require("../config/cloudinary/config"));
(0, config_1.default)();
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/") ||
            file.mimetype === "application/pdf") {
            cb(null, true);
        }
        else {
            cb(new Error("Only images and PDFs are allowed!"));
        }
    },
});
const uploadToCloudinary = async (buffer, folder, publicId, isPDF = false) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            public_id: publicId,
            resource_type: isPDF ? "raw" : "image",
            quality: isPDF ? undefined : "auto",
            fetch_format: isPDF ? undefined : "auto",
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
            }
            else {
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        });
        uploadStream.end(buffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId, isPDF = false) => {
    try {
        await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: isPDF ? "raw" : "image",
        });
    }
    catch (error) {
        console.error("Cloudinary delete error:", error);
        throw error;
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.default = cloudinary_1.v2;
