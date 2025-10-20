"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const authRouter = express_1.default.Router();
authRouter.post("/register-student", async (req, res, next) => {
    try {
        await (0, auth_1.studentRegistration)(req, res);
    }
    catch (error) {
        next(error);
    }
});
authRouter.post("/register-professor", async (req, res, next) => {
    try {
        await (0, auth_1.professorRegistration)(req, res);
    }
    catch (error) {
        next(error);
    }
});
authRouter.post("/login-student", async (req, res, next) => {
    try {
        await (0, auth_1.studentLogin)(req, res);
    }
    catch (error) {
        next(error);
    }
});
authRouter.post("/login-professor", async (req, res, next) => {
    try {
        await (0, auth_1.professorLogin)(req, res);
    }
    catch (error) {
        next(error);
    }
});
authRouter.get("/me", auth_2.authMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.me)(req, res);
    }
    catch (error) {
        next(error);
    }
});
authRouter.post("/refresh", async (req, res, next) => {
    try {
        await (0, auth_1.refreshTokens)(req, res);
    }
    catch (error) {
        next(error);
    }
});
authRouter.post("/logout", async (req, res, next) => {
    try {
        await (0, auth_1.logoutUser)(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = authRouter;
