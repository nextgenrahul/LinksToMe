import { Request, Response } from 'express';
import authService from './auth.services';
import { catchAsync } from 'backend/src/shared/utils/catchAsync';
import { refreshTokenCookieOptions } from 'backend/src/config/cookies';

export class AuthController {
  private service = authService;

  public register = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const meta = {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };

    const { user, accessToken, refreshToken } =
      await this.service.signup(payload, meta);

    // // Refresh token 
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

  public async login() {
    try {
      console.log("login")
    } catch (error) {
      console.log(error)
    }
  }




}

export default new AuthController();