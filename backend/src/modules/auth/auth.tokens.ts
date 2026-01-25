import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { TokenPayload } from "./auth.types";

export const generateAccessToken = (userId: string): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY;

  if (!secret || !expiresIn) {
    throw new Error("JWT Configuration missing: Check ACCESS_TOKEN_SECRET and EXPIRY");
  }

  const payload: TokenPayload = { sub: userId };
  
  const options: SignOptions = {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};


export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};


export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};