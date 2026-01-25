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