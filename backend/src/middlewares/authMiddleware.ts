import jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import { JWT_PAYLOAD } from '../types';

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized / no token',
    });
  }

  try {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    , (err, decoded ) => {
      if (err)  return res.status(403).json({message: 'Invalid token'});
      
      const { id } = decoded as JWT_PAYLOAD;
      req.userId = id ;
      next();
    })

  } catch (error) {
    return res.status(403).json({
      message: 'Invalid token',
    });
  }
};
