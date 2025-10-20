"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.professorLogin = exports.studentLogin = exports.professorRegistration = exports.studentRegistration = void 0;
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
        };
        const refreshTokenPayload = {
            userId: student.id,
        };
        const accessToken = (0, token_1.createAccessToken)(accessTokenPayload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
        const refreshToken = (0, token_1.createRefreshToken)(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY);
        const hashedRefreshToken = await (0, token_1.hashRefreshToken)(refreshToken);
        await db_1.default.users.update({
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
        };
        const refreshTokenPayload = {
            userId: professor.id,
        };
        const accessToken = (0, token_1.createAccessToken)(accessTokenPayload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
        const refreshToken = (0, token_1.createRefreshToken)(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY);
        const hashedRefreshToken = await (0, token_1.hashRefreshToken)(refreshToken);
        await db_1.default.users.update({
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
