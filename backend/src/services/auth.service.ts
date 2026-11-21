import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { config } from '../config/env';
import { RegisterInput, LoginInput, UpdateProfileInput } from '../schemas/auth.schema';
import { AppError } from '../middleware/error.middleware';

export class AuthService {
  public static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      const error: AppError = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        targetRole: input.targetRole || null,
        targetCompany: input.targetCompany || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        targetRole: true,
        targetCompany: true,
        bio: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return { token, user };
  }

  public static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      const error: AppError = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      const error: AppError = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetRole: user.targetRole,
      targetCompany: user.targetCompany,
      bio: user.bio,
      createdAt: user.createdAt,
    };

    return { token, user: safeUser };
  }

  public static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        targetRole: true,
        targetCompany: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error: AppError = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  public static async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error: AppError = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const dataToUpdate: any = {};

    if (input.name !== undefined) dataToUpdate.name = input.name;
    if (input.targetRole !== undefined) dataToUpdate.targetRole = input.targetRole;
    if (input.targetCompany !== undefined) dataToUpdate.targetCompany = input.targetCompany;
    if (input.bio !== undefined) dataToUpdate.bio = input.bio;

    if (input.newPassword) {
      if (!input.currentPassword) {
        const error: AppError = new Error('Current password is required to set a new password.');
        error.statusCode = 400;
        throw error;
      }

      const isMatch = await bcrypt.compare(input.currentPassword, user.passwordHash);
      if (!isMatch) {
        const error: AppError = new Error('Current password does not match.');
        error.statusCode = 400;
        throw error;
      }

      const salt = await bcrypt.genSalt(10);
      dataToUpdate.passwordHash = await bcrypt.hash(input.newPassword, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        targetRole: true,
        targetCompany: true,
        bio: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }
}
