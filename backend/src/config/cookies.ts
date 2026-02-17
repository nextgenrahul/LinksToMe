import { CookieOptions } from "express";

export const refreshTokenCookieOptions = (): CookieOptions => {
    const maxAgeDays = Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE_DAYS);

    if (!maxAgeDays || Number.isNaN(maxAgeDays)) {
        throw new Error("Invalid REFRESH_TOKEN_COOKIE_MAX_AGE_DAYS");
    }

    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: (process.env.REFRESH_TOKEN_COOKIE_SAMESITE as "lax" | "strict" | "none") || "lax",
        path: process.env.REFRESH_TOKEN_COOKIE_PATH || "/",
        maxAge: maxAgeDays * 24 * 60 * 60 * 1000,
    };
};


export const accessTokenCookieOptions = (): CookieOptions => {
    const expiryMinutes = 15;

    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: expiryMinutes * 60 * 1000,
    };
};
