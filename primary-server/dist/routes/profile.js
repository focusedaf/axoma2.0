"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profile_1 = require("../controllers/profile");
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const profileRouter = express_1.default.Router();
profileRouter.post("/setupProfile", auth_1.authMiddleware, async (req, res, next) => {
    try {
        if (req.user?.role === "student") {
            await (0, profile_1.setupStudentProfile)(req, res);
        }
        else if (req.user?.role === "professor") {
            await (0, profile_1.setupProfessorProfile)(req, res);
        }
        else {
            res.status(400).json({ message: "Invalid user role" });
        }
    }
    catch (error) {
        next(error);
    }
});
profileRouter.put("/edit-profile", auth_1.authMiddleware, async (req, res, next) => {
    try {
        if (req.user?.role === "student") {
            await (0, profile_1.editStudentProfile)(req, res);
        }
        else if (req.user?.role === "professor") {
            await (0, profile_1.editProfessorProfile)(req, res);
        }
        else {
            res.status(400).json({ message: "Invalid user role" });
        }
    }
    catch (error) {
        next(error);
    }
});
profileRouter.get("/user-data", auth_1.authMiddleware, async (req, res, next) => {
    try {
        if (req.user?.role === "student") {
            await (0, profile_1.getStudentProfile)(req, res);
        }
        else if (req.user?.role === "professor") {
            await (0, profile_1.getProfessorProfile)(req, res);
        }
        else {
            res.status(400).json({ message: "Invalid user role" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = profileRouter;
