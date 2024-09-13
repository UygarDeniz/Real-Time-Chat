import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../db.js';
import { Request, Response } from 'express';
import { JWT_PAYLOAD } from '../types.js';
import { generateTokens, setRefreshTokenCookie } from '../utils/authToken.js';

export const register = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { name },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = await generateTokens(newUser.id);

    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
    });

    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      accessToken,
      message: 'User created',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res
      .status(500)
      .json({ message: 'An error occurred during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { name },
    });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = await generateTokens(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      id: user.id,
      name: user.name,
      accessToken,
      message: 'User logged in',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An error occurred during login' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken as string;
  if (!refreshToken) {
    return res.status(200).json({ message: 'User logged out' });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    async (error, decoded) => {
      const { id } = decoded as JWT_PAYLOAD;
      await prisma.user.update({
        where: { id },
        data: { refreshToken: null },
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      return res.status(200).json({ message: 'User logged out' });
    }
  );
};

export const currentUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { name: true, id: true },
  });
  return res.status(200).json({ name: user?.name, id: user?.id });
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return res
      .status(500)
      .json({ message: 'An error occurred while fetching the user' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken as string;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Not authorized / no token' });
  }

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      async (error, decoded) => {
        if (error) return res.status(403).json({ message: 'Invalid token' });

        const { id } = decoded as JWT_PAYLOAD;
        const user = await prisma.user.findUnique({
          where: { id },
        });

        if (!user || user.refreshToken !== refreshToken) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await generateTokens(user.id);

        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: newRefreshToken },
        });

        setRefreshTokenCookie(res, newRefreshToken);

        return res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.error('Error verifying token:', error);

    return res.status(403).json({ message: 'Forbidden' });
  }
};

export const getUserWithAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken as string;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Not authorized / no token' });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      async (error, decoded) => {
        if (error) return res.status(403).json({ message: 'Invalid token' });

        const { id } = decoded as JWT_PAYLOAD;
        const user = await prisma.user.findUnique({
          where: { id },
        });

        if (!user || user.refreshToken !== refreshToken) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const { accessToken, refreshToken: newRefreshToken } =
          await generateTokens(user.id);

        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: newRefreshToken },
        });

        setRefreshTokenCookie(res, newRefreshToken);

        return res.status(200).json({
          id: user.id,
          name: user.name,
          accessToken,
        });
      }
    );
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};
