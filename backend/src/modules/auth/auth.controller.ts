import { Request, Response } from 'express';
import authService from './auth.services';
import { catchAsync } from 'backend/src/shared/utils/catchAsync';
import { refreshTokenCookieOptions } from 'backend/src/config/cookies';
import { AppError } from 'backend/src/shared/utils/AppError';
// auth.middleware.ts
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
export class AuthController {
  private service = authService;
  public me = async (req: AuthRequest, res: Response) => {
    return res.status(200).json({
      user: req.user,
    });
  };


  public register = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const meta = {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };

    const { user, accessToken, refreshToken } = await this.service.signup(payload, meta);

    // Refresh token 
    res.cookie(
      process.env.REFRESH_TOKEN_COOKIE_NAME!,
      refreshToken,
      refreshTokenCookieOptions()
    );

    // Access Token
    return res.status(201).json({
      success: true,
      user,
      accessToken,
    });
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await this.service.login(req.body, {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    res.cookie(
      process.env.REFRESH_TOKEN_COOKIE_NAME!,
      refreshToken,
      refreshTokenCookieOptions()
    );
    return res.status(200).json({
      success: true,
      user,
      accessToken,
    });
  });

  public generateRefreshToken = catchAsync(async (req: Request, res: Response) => {
    const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME!;
    const refreshToken = await req.cookies?.[cookieName];
    if (!refreshToken) {
      throw new AppError("Unauthorized: Token not found", 401);
    }
    const { accessToken, user } = await this.service.refresh(refreshToken);
    return res.status(200).json({
      success: true,
      accessToken,
      user
    });
  });

  public logout = catchAsync(async (req: Request, res: Response) => {
    const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME!;
    const refreshToken = req.cookies?.[cookieName];

    if (refreshToken) {
      await this.service.logout(refreshToken);
    }

    res.clearCookie(cookieName, {
      path: process.env.REFRESH_TOKEN_COOKIE_PATH,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });




}

export default new AuthController();