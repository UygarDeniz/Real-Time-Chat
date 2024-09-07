import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { Request, Response, NextFunction } from 'express';
import { JWT_PAYLOAD } from '../types';

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized / no token',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWT_PAYLOAD;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Not authorized / user not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);

    return res.status(401).json({
      message: 'Not authorized / invalid token',
    });
  }
};
