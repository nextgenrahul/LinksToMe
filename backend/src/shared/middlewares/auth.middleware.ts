import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import authRepository from "../../modules/auth/auth.repository";
import { AppError } from "../../shared/utils/AppError";
import { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
    sub: string;
    typ: "access";
    iat?: number;
    exp?: number;
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


class AuthMiddleware {
    public verify = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            let token = req.headers.authorization;
            console.log(req.headers.authorization)

            if (req.headers.authorization?.startsWith("Bearer ")) {
                token = req.headers.authorization.slice(7);
            }

            if (!token) {
                throw new AppError("Authentication required. Access denied.", 401);
            }

            const secret = process.env.ACCESS_TOKEN_SECRET;
            if (!secret) {
                throw new Error("ACCESS_TOKEN_SECRET is not defined in environment");
            }
            const decoded = verify(token, secret) as TokenPayload;

            const user = await authRepository.findById(decoded.sub);

            if (!user) {
                throw new AppError("The user belonging to this token no longer exists.", 401);
            }

            if (user.account_status !== 'active') {
                throw new AppError("Account restricted. Please contact support.", 403);
            }

            req.user = {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                account_status: user.account_status,
            };

            req.token = token;

            next();

        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                return next(new AppError("Session expired. Please log in again.", 401));
            }
            if (error.name === "JsonWebTokenError") {
                return next(new AppError("Invalid security token.", 401));
            }
            next(error);
        }
    };
}

export default new AuthMiddleware();