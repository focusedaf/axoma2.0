"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userSchema = exports.newUser = exports.passwordSchema = exports.emailSchema = exports.walletSchema = exports.mobileSchema = exports.roleSchema = exports.lastNameSchema = exports.firstNameSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.firstNameSchema = zod_1.default
    .string()
    .trim()
    .min(2, "Too short")
    .max(30, "Too long");
exports.lastNameSchema = zod_1.default
    .string()
    .trim()
    .min(2, "Too short")
    .max(30, "Too long");
exports.roleSchema = zod_1.default.enum(["student", "professor"]);
exports.mobileSchema = zod_1.default
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits");
exports.walletSchema = zod_1.default
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address");
exports.emailSchema = zod_1.default
    .string()
    .trim()
    .email("Please enter a valid email");
exports.passwordSchema = zod_1.default
    .string()
    .min(8, "Password must contain at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/\d/, "Must contain at least one digit")
    .regex(/[@$!%*?&#]/, "Must contain at least one special char");
exports.newUser = zod_1.default.object({
    firstName: exports.firstNameSchema,
    lastName: exports.lastNameSchema,
    mobileNumber: exports.mobileSchema,
    role: exports.roleSchema,
    email: exports.emailSchema,
    password: exports.passwordSchema,
    walletAddress: exports.walletSchema,
});
exports.userSchema = zod_1.default.object({
    id: zod_1.default.string().uuid(),
    firstName: exports.firstNameSchema,
    lastName: exports.lastNameSchema,
    mobileNumber: exports.mobileSchema,
    role: exports.roleSchema,
    email: exports.emailSchema,
    password: zod_1.default.string(),
    walletAddress: exports.walletSchema,
    isVerified: zod_1.default.boolean().default(false),
    refreshToken: zod_1.default.string(),
    createdAt: zod_1.default.date(),
    updatedAt: zod_1.default.date(),
});
exports.loginSchema = zod_1.default.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
});
