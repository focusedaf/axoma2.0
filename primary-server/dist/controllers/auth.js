"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = exports.logoutUser = exports.me = exports.professorLogin = exports.studentLogin = exports.professorRegistration = exports.studentRegistration = void 0;
const db_1 = __importDefault(require("../db/db"));
const zod_1 = require("../zod/zod");
const token_1 = require("../utils/token");
const studentRegistration = async (req, res) => {
    try {
        const validation = zod_1.newUser.safeParse(req.body);
        if (!validation.success) {
            return res
                .status(400)
                .json({ success: false, message: "Validation failed" });
        }
        const { firstName, lastName, mobileNumber, role, email, password, walletAddress, } = validation.data;
        const existingStudent = await db_1.default.students.findUnique({
            where: { email },
        });
        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Email already in use",
            });
        }
        const existingWallet = await db_1.default.students.findUnique({
            where: { walletAddress },
        });
        if (existingWallet) {
            return res.status(409).json({
                success: false,
                message: "Wallet address already in use",
            });
        }
        const hashedPwd = await (0, token_1.hashPassword)(password);
        const student = await db_1.default.students.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                mobileNumber: mobileNumber,
                role: role,
                email: email,
                password: hashedPwd,
                walletAddress: walletAddress,
                isVerified: false,
            },
        });
        const checkStudent = await db_1.default.students.findUnique({
            where: { id: student.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                mobileNumber: true,
                role: true,
                email: true,
                walletAddress: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!checkStudent) {
            return res
                .status(500)
                .json({ success: false, message: "Registration Process Failed" });
        }
        else {
            return res.status(201).json({
                success: true,
                message: "Student registered successfully",
                student: checkStudent,
            });
        }
    }
    catch (error) {
        console.error("Student registration error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.studentRegistration = studentRegistration;
const professorRegistration = async (req, res) => {
    try {
        const validation = zod_1.newUser.safeParse(req.body);
        if (!validation.success) {
            return res
                .status(400)
                .json({ success: false, message: "Validation failed" });
        }
        const { firstName, lastName, mobileNumber, role, email, password, walletAddress, } = validation.data;
        const existingProfessor = await db_1.default.professors.findUnique({
            where: { email },
        });
        if (existingProfessor) {
            return res.status(409).json({
                success: false,
                message: "Email already in use",
            });
        }
        const existingWallet = await db_1.default.professors.findUnique({
            where: { walletAddress },
        });
        if (existingWallet) {
            return res.status(409).json({
                success: false,
                message: "Wallet address already in use",
            });
        }
        const hashedPwd = await (0, token_1.hashPassword)(password);
        const professor = await db_1.default.professors.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                mobileNumber: mobileNumber,
                role: role,
                email: email,
                password: hashedPwd,
                walletAddress: walletAddress,
                isVerified: false,
            },
        });
        const checkProfessor = await db_1.default.professors.findUnique({
            where: { id: professor.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                mobileNumber: true,
                role: true,
                email: true,
                walletAddress: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!checkProfessor) {
            return res
                .status(500)
                .json({ success: false, message: "Registration Process Failed" });
        }
        else {
            return res.status(201).json({
                success: true,
                message: "Professor registered successfully",
                professor: checkProfessor,
            });
        }
    }
    catch (error) {
        console.error("Professor registration error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.professorRegistration = professorRegistration;
const studentLogin = async (req, res) => {
    try {
        const validation = zod_1.loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res
                .status(400)
                .json({ success: false, message: "validation failed" });
        }
        const { email, password } = validation.data;
        const student = await db_1.default.students.findUnique({
            where: { email },
        });
        if (!student) {
            return res
                .status(401)
                .json({ success: false, message: "Student not registered" });
        }
        const isValidPwd = await (0, token_1.verifyPassword)(password, student.password);
        if (!isValidPwd) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }
        const accessTokenPayload = {
            userId: student.id,
            role: student.role,
        };
        const refreshTokenPayload = {
            userId: student.id,
            role: student.role,
        };
        const accessToken = (0, token_1.createAccessToken)(accessTokenPayload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
        const refreshToken = (0, token_1.createRefreshToken)(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY);
        const hashedRefreshToken = await (0, token_1.hashRefreshToken)(refreshToken);
        await db_1.default.students.update({
            where: { id: student.id },
            data: { refreshToken: hashedRefreshToken },
        });
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            path: "/",
        };
        console.log("accesstoken", accessToken);
        console.log("refreshtoken", refreshToken);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
            success: true,
            message: "Student logged in successfully",
            user: {
                id: student.id,
                email: student.email,
                firstName: student.firstName,
                lastName: student.lastName,
            },
        });
    }
    catch (error) {
        console.error("Student login error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.studentLogin = studentLogin;
const professorLogin = async (req, res) => {
    try {
        const validation = zod_1.loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res
                .status(400)
                .json({ success: false, message: "validation failed" });
        }
        const { email, password } = validation.data;
        const professor = await db_1.default.professors.findUnique({ where: { email } });
        if (!professor) {
            return res
                .status(401)
                .json({ success: false, message: "Professor not registered" });
        }
        const isValidPwd = await (0, token_1.verifyPassword)(password, professor.password);
        if (!isValidPwd) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }
        const accessTokenPayload = {
            userId: professor.id,
            role: professor.role,
        };
        const refreshTokenPayload = {
            userId: professor.id,
            role: professor.role,
        };
        const accessToken = (0, token_1.createAccessToken)(accessTokenPayload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
        const refreshToken = (0, token_1.createRefreshToken)(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY);
        const hashedRefreshToken = await (0, token_1.hashRefreshToken)(refreshToken);
        await db_1.default.professors.update({
            where: { id: professor.id },
            data: { refreshToken: hashedRefreshToken },
        });
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            path: "/",
        };
        console.log("accesstoken", accessToken);
        console.log("refreshtoken", refreshToken);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
            success: true,
            message: "Professor logged in successfully",
            user: {
                id: professor.id,
                email: professor.email,
                firstName: professor.firstName,
                lastName: professor.lastName,
            },
        });
    }
    catch (error) {
        console.error("Professor login error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.professorLogin = professorLogin;
// to get the logged in user's info
const me = async (req, res) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Not authenticated" });
        }
        const decoded = (0, token_1.verifyAccessToken)(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        const { userId, role } = decoded;
        let user;
        if (role === "student") {
            user = await db_1.default.students.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    mobileNumber: true,
                    email: true,
                    role: true,
                    walletAddress: true,
                },
            });
        }
        else {
            user = await db_1.default.professors.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    mobileNumber: true,
                    email: true,
                    role: true,
                    walletAddress: true,
                },
            });
        }
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        console.error("Me error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.me = me;
const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res
                .status(400)
                .json({ success: false, message: "No refresh token provided" });
        }
        const decoded = (0, token_1.verifyRefreshToken)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid refresh token" });
        }
        const { userId, role } = decoded;
        if (role === "student") {
            await db_1.default.students.update({
                where: { id: userId },
                data: { refreshToken: null },
            });
        }
        else {
            await db_1.default.professors.update({
                where: { id: userId },
                data: { refreshToken: null },
            });
        }
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            path: "/",
        };
        return res
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .status(200)
            .json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        return res
            .status(500)
            .json({ success: false, message: error.message });
    }
};
exports.logoutUser = logoutUser;
// to refresh both access n refresh tokens
const refreshTokens = async (req, res) => {
    try {
        const normalRefreshToken = req.cookies?.refreshToken;
        if (!normalRefreshToken) {
            return res
                .status(401)
                .json({ success: false, message: "Refresh token required" });
        }
        const decoded = (0, token_1.verifyRefreshToken)(normalRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid or expired refresh token" });
        }
        const { userId, role } = decoded;
        const user = role === "student"
            ? await db_1.default.students.findUnique({ where: { id: userId } })
            : await db_1.default.professors.findUnique({ where: { id: userId } });
        if (!user || !user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "User not found or no refresh token stored",
            });
        }
        const isValidRT = await (0, token_1.verifyPassword)(normalRefreshToken, user.refreshToken);
        if (!isValidRT) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid refresh token" });
        }
        const newTokens = (0, token_1.rotateTokens)({ userId: user.id, role: user.role }, { userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET);
        const hashedNewRefreshToken = await (0, token_1.hashRefreshToken)(newTokens.refreshToken);
        if (role === "student") {
            await db_1.default.students.update({
                where: { id: userId },
                data: { refreshToken: hashedNewRefreshToken },
            });
        }
        else {
            await db_1.default.professors.update({
                where: { id: userId },
                data: { refreshToken: hashedNewRefreshToken },
            });
        }
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            path: "/",
        };
        return res
            .cookie("accessToken", newTokens.accessToken, options)
            .cookie("refreshToken", newTokens.refreshToken, options)
            .json({ success: true, message: "Tokens refreshed successfully" });
    }
    catch (error) {
        console.error("Refresh token error:", error);
        return res
            .status(500)
            .json({ success: false, message: error.message });
    }
};
exports.refreshTokens = refreshTokens;
