import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
export interface AccessTokenPayload extends JwtPayload {
  userId: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  userId: string;
}

export const hashPassword = async (password: string) => {
  const saltRounds = 14;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

export const createAccessToken = (
  payload: AccessTokenPayload,
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, { expiresIn: "15m" });
};

export const createRefreshToken = (
  payload: RefreshTokenPayload,
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export const hashRefreshToken = async (token: string) => {
  return await bcrypt.hash(token, 12);
};

export const decodedAccessToken = (
  token: string
): AccessTokenPayload | null => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") return null;
    return decoded as AccessTokenPayload;
  } catch {
    return null;
  }
};

export const rotateTokens = (
  accessPayload: AccessTokenPayload,
  refreshPayload: RefreshTokenPayload,
  accessSecret: string,
  refreshSecret: string
) => {
  return {
    accessToken: createAccessToken(accessPayload, accessSecret, "15m"),
    refreshToken: createRefreshToken(refreshPayload, refreshSecret, "7d"),
  };
};
