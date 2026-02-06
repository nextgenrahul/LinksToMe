import { RequestHandler } from "express";


export interface TokenPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenHash: string;
  userAgent?: string;
  ip?: string;
  expiresAt: Date;
}

export interface Route {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  preValidation?: RequestHandler;
  preHandler?: RequestHandler;
  handler: RequestHandler;
}


export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    name: string;
    account_status: "active" | "suspended" | "deleted";
  };
  token?: string;

}


export interface RefreshTokenSession {
  user_id: string;
  expires_at: Date;
  id: string;
  username: string;
  email: string;
  account_status: string;
  created_at: Date;
}

export interface UserRow {
  id: string;
  email: string;
  username: string;
  name: string;
  account_status: string;
}