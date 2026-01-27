import jwt, { verify } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";


class AuthMiddleware {
    public verifyToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token = req.headers.authorization;
            if (token && token.startsWith("Bearer ")) {
                token = token.slice(7);
            }
            console.log(token)
            if (!token) {
                throw new AppError("Authentication required. Access denied.", 401);
            }




        } catch (error) {

        }
    });
}