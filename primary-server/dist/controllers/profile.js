"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfessorProfile = exports.getStudentProfile = exports.editProfessorProfile = exports.editStudentProfile = exports.setupProfessorProfile = exports.setupStudentProfile = void 0;
const db_1 = __importDefault(require("../db/db"));
const zod_1 = require("../zod/zod");
const token_1 = require("../utils/token");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const studentPartialSchema = zod_1.setupProfileSchema.options[0].partial();
const professorPartialSchema = zod_1.setupProfileSchema.options[1].partial();
const setupStudentProfile = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token)
            return res
                .status(400)
                .json({ success: false, message: "No auth token found" });
        const decoded = (0, token_1.verifyAccessToken)(token, accessTokenSecret);
        if (!decoded)
            return res
                .status(401)
                .json({ success: false, message: "Token invalid or expired" });
        const studentId = decoded.id || decoded.studentId;
        const student = await db_1.default.students.findUnique({
            where: { id: studentId },
        });
        if (!student)
            return res
                .status(404)
                .json({ success: false, message: "Student not found" });
        const validation = zod_1.setupProfileSchema.options[0].safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues,
            });
        }
        const existingProfile = await db_1.default.studentProfile.findUnique({
            where: { studentID: studentId },
        });
        if (existingProfile)
            return res
                .status(409)
                .json({ success: false, message: "Profile already exists" });
        const profile = await db_1.default.studentProfile.create({
            data: { ...validation.data, studentID: studentId },
        });
        res.status(201).json({
            success: true,
            message: "Student profile created",
            data: profile,
        });
    }
    catch (error) {
        console.error("Student profile onboarding couldn't be completed", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.setupStudentProfile = setupStudentProfile;
const setupProfessorProfile = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token)
            return res
                .status(400)
                .json({ success: false, message: "No auth token found" });
        const decoded = (0, token_1.verifyAccessToken)(token, accessTokenSecret);
        if (!decoded)
            return res
                .status(401)
                .json({ success: false, message: "Token invalid or expired" });
        const professorId = decoded.id || decoded.professorId;
        const professor = await db_1.default.professors.findUnique({
            where: { id: professorId },
        });
        if (!professor)
            return res
                .status(404)
                .json({ success: false, message: "Professor not found" });
        const validation = zod_1.setupProfileSchema.options[1].safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues,
            });
        }
        const existingProfile = await db_1.default.professorProfile.findUnique({
            where: { professorID: professorId },
        });
        if (existingProfile)
            return res
                .status(409)
                .json({ success: false, message: "Profile already exists" });
        const profile = await db_1.default.professorProfile.create({
            data: { ...validation.data, professorID: professorId },
        });
        res.status(201).json({
            success: true,
            message: "Professor profile created",
            data: profile,
        });
    }
    catch (error) {
        console.error("Professor onboarding couldn't be completed", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.setupProfessorProfile = setupProfessorProfile;
const editStudentProfile = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token)
            return res
                .status(400)
                .json({ success: false, message: "No auth token found" });
        const decoded = (0, token_1.verifyAccessToken)(token, accessTokenSecret);
        if (!decoded)
            return res
                .status(401)
                .json({ success: false, message: "Token invalid or expired" });
        const studentId = decoded.id || decoded.studentId;
        const validation = studentPartialSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues,
            });
        }
        const updatedProfile = await db_1.default.studentProfile.update({
            where: { studentID: studentId },
            data: validation.data,
        });
        res.status(200).json({
            success: true,
            message: "Student profile updated",
            data: updatedProfile,
        });
    }
    catch (error) {
        console.error("Couldn't edit student profile", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.editStudentProfile = editStudentProfile;
const editProfessorProfile = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token)
            return res
                .status(400)
                .json({ success: false, message: "No auth token found" });
        const decoded = (0, token_1.verifyAccessToken)(token, accessTokenSecret);
        if (!decoded)
            return res
                .status(401)
                .json({ success: false, message: "Token invalid or expired" });
        const professorId = decoded.id || decoded.professorId;
        const validation = professorPartialSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues,
            });
        }
        const updatedProfile = await db_1.default.professorProfile.update({
            where: { professorID: professorId },
            data: validation.data,
        });
        res.status(200).json({
            success: true,
            message: "Professor profile updated",
            data: updatedProfile,
        });
    }
    catch (error) {
        console.error("Couldn't edit professor profile", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.editProfessorProfile = editProfessorProfile;
const getStudentProfile = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token)
            return res
                .status(400)
                .json({ success: false, message: "No auth token found" });
        const decoded = (0, token_1.verifyAccessToken)(token, accessTokenSecret);
        if (!decoded)
            return res
                .status(401)
                .json({ success: false, message: "Token invalid or expired" });
        const studentId = decoded.id || decoded.studentId;
        const profile = await db_1.default.studentProfile.findUnique({
            where: { studentID: studentId },
        });
        if (!profile)
            return res
                .status(404)
                .json({ success: false, message: "Profile not found" });
        res.status(200).json({
            success: true,
            message: "Student profile fetched",
            data: profile,
        });
    }
    catch (error) {
        console.error("Student profile couldn't be fetched", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getStudentProfile = getStudentProfile;
const getProfessorProfile = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token)
            return res
                .status(400)
                .json({ success: false, message: "No auth token found" });
        const decoded = (0, token_1.verifyAccessToken)(token, accessTokenSecret);
        if (!decoded)
            return res
                .status(401)
                .json({ success: false, message: "Token invalid or expired" });
        const professorId = decoded.id || decoded.professorId;
        const profile = await db_1.default.professorProfile.findUnique({
            where: { professorID: professorId },
        });
        if (!profile)
            return res
                .status(404)
                .json({ success: false, message: "Profile not found" });
        res.status(200).json({
            success: true,
            message: "Professor profile fetched",
            data: profile,
        });
    }
    catch (error) {
        console.error("Professor profile couldn't be fetched", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getProfessorProfile = getProfessorProfile;
