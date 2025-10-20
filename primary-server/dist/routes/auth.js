"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const authRouter = express_1.default.Router();
authRouter.post("/register-student", auth_1.studentRegistration);
authRouter.post("/register-professor", auth_1.professorRegistration);
authRouter.post("/login-student", auth_1.studentLogin);
authRouter.post("/login-professor", auth_1.professorLogin);
authRouter.get("/me", auth_2.authMiddleware, auth_1.me);
authRouter.post("/refresh", auth_1.refreshTokens);
authRouter.post("/logout", auth_1.logoutUser);
exports.default = authRouter;
