"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateTokens = exports.decodedAccessToken = exports.hashRefreshToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.createRefreshToken = exports.createAccessToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hashPassword = async (password) => {
    const saltRounds = 14;
    const hash = await bcrypt_1.default.hash(password, saltRounds);
    return hash;
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hashedPassword) => {
    return bcrypt_1.default.compare(password, hashedPassword);
};
exports.verifyPassword = verifyPassword;
const createAccessToken = (payload, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "15m" });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (payload, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "7d" });
};
exports.createRefreshToken = createRefreshToken;
const verifyAccessToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const hashRefreshToken = async (token) => {
    return await bcrypt_1.default.hash(token, 12);
};
exports.hashRefreshToken = hashRefreshToken;
const decodedAccessToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || typeof decoded === "string")
            return null;
        return decoded;
    }
    catch {
        return null;
    }
};
exports.decodedAccessToken = decodedAccessToken;
const rotateTokens = (accessPayload, refreshPayload, accessSecret, refreshSecret) => {
    return {
        accessToken: (0, exports.createAccessToken)(accessPayload, accessSecret, "15m"),
        refreshToken: (0, exports.createRefreshToken)(refreshPayload, refreshSecret, "7d"),
    };
};
exports.rotateTokens = rotateTokens;
