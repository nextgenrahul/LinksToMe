import { Request, Response } from 'express';
import authService from './auth.services';

export class AuthController {
  private service = authService;

  public async register(req: Request, res: Response) {
    try {
      const user = await this.service.signup(req.body);

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new AuthController();