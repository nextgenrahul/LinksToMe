import { NextFunction, Request, Response } from 'express';
import authService from './auth.services';
import { catchAsync } from 'backend/src/shared/utils/catchAsync';
import { refreshTokenCookieOptions } from 'backend/src/config/cookies';
import { AppError } from 'backend/src/shared/utils/AppError';
import { AuthRequest } from './auth.types';
import { hashToken } from 'backend/src/shared/utils/auth.tokens';
import authRepository from './auth.repository';


export class AuthController {
  private service = authService;


  public register = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const meta = {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };

    const { user, accessToken, refreshToken } = await this.service.signup(payload, meta);

    res.cookie(
      process.env.REFRESH_TOKEN_COOKIE_NAME!,
      refreshToken,
      refreshTokenCookieOptions()
    );

    return res.status(201).json({
      success: true,
      user,
      accessToken,
    });
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.login(req.body, {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    if (result instanceof AppError) {
      throw result;
    }

    const { user, accessToken, refreshToken } = result;

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

  public bootstrapSession = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ) => {
    const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME!;

    const refreshToken = req.cookies?.[cookieName];

    console.log(refreshToken)
    if (!refreshToken) {
      return next(new AppError("Unauthenticated", 401));
    }

    const refreshTokenHash = hashToken(refreshToken);

    const session = await authRepository.findRefreshToken(refreshTokenHash);

    if (!session || session.revoked_at || session.expires_at < new Date()) {
      return next(new AppError("Session expired", 401));
    }

    const user = await authRepository.findById(session.user_id);

    if (!user || user.account_status !== "active") {
      return next(new AppError("Account restricted", 403));
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      account_status: user.account_status,
    };

    next();
  };




}

export default new AuthController();