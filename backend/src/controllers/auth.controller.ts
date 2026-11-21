import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Account created successfully.',
        token: result.token,
        user: result.user,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        status: 'success',
        message: 'Logged in successfully.',
        token: result.token,
        user: result.user,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.getUserById(req.user!.id);
      res.status(200).json({
        status: 'success',
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedUser = await AuthService.updateProfile(req.user!.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully.',
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async logout(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.',
    });
  }
}
