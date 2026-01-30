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