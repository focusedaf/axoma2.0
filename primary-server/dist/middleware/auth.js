"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const token_1 = require("../utils/token");
const authMiddleware = (req, res, next) => {
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
        req.user = decoded;
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
