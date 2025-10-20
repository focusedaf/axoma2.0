"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const db_1 = __importDefault(require("../db/db"));
const token_1 = require("../utils/token");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken ||
            req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token required",
            });
        }
        const decoded = (0, token_1.verifyAccessToken)(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
        const { userId, role } = decoded;
        const user = role === "student"
            ? await db_1.default.students.findUnique({ where: { id: userId } })
            : await db_1.default.professors.findUnique({ where: { id: userId } });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        req.user = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }
};
exports.authMiddleware = authMiddleware;
