import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { AuthRepository } from "../../modules/auth/auth.repository";
import { AppError } from "../../shared/utils/AppError";

interface TokenPayload extends JwtPayload {
  sub: string;
  typ?: "access";
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

export class AuthMiddleware {
  constructor(private readonly repo: AuthRepository) {}

  public verify = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Authentication required.", 401);
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        throw new AppError("Authentication required.", 401);
      }

      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET not configured");
      }

      const decoded = verify(token, secret) as TokenPayload;

      if (decoded.typ && decoded.typ !== "access") {
        throw new AppError("Invalid token type.", 401);
      }

      const user = await this.repo.findUserById(decoded.sub);

      if (!user) {
        throw new AppError("User no longer exists.", 401);
      }

      if (user.account_status !== "active") {
        throw new AppError("Account restricted.", 403);
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
        return next(new AppError("Session expired.", 401));
      }

      if (error.name === "JsonWebTokenError") {
        return next(new AppError("Invalid token.", 401));
      }

      next(error);
    }
  };
}
