import { Request, Response } from "express";
import { AuthService } from "./auth.services";
import { catchAsync } from "backend/src/shared/utils/catchAsync";
import { refreshTokenCookieOptions } from "backend/src/config/cookies";
import { AppError } from "backend/src/shared/utils/AppError";

export class AuthController {
  constructor(private readonly service: AuthService) { }

  private setRefreshCookie(res: Response, refreshToken: string) {
    const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";
    res.cookie(cookieName, refreshToken, refreshTokenCookieOptions());
  }

  public register = catchAsync(async (req: Request, res: Response) => {
    const meta = {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };

    const { user, accessToken, refreshToken } =
      await this.service.signup(req.body, meta);

    this.setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      user,
      accessToken,
    });
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const meta = {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };

    const { user, accessToken, refreshToken } =
      await this.service.login(req.body, meta);

    this.setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      user,
      accessToken,
    });
  });

  public refresh = catchAsync(async (req: Request, res: Response) => {
    const cookieName =
      process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";


    const oldRefreshToken = req.cookies?.[cookieName];
    if (!oldRefreshToken)
      throw new AppError("Unauthorized", 401);

    const meta = {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };

    const { accessToken, refreshToken } =
      await this.service.refresh(oldRefreshToken, meta);

    this.setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      accessToken,
    });
  });


  public logout = catchAsync(async (req: Request, res: Response) => {
    const cookieName =
      process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";

    const refreshToken = req.cookies?.[cookieName];

    await this.service.logout(refreshToken);

    res.clearCookie(cookieName, {
      path: process.env.REFRESH_TOKEN_COOKIE_PATH || "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });

  public me = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await this.service.getUserById(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  });

}
