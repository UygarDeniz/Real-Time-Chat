import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const generateTokens = async (id: string) => {
  const accessToken = await new Promise<string>((resolve, reject) => {
    jwt.sign(
      { id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '5s' },
      (err, token) => {
        if (err || !token) return reject(err);
        return resolve(token);
      }
    );
  });

  const refreshToken = await new Promise<string>((resolve, reject) => {
    jwt.sign(
      { id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '30d' },
      (err, token) => {
        if (err || !token) return reject(err);
        return resolve(token);
      }
    );
  });

  return { accessToken, refreshToken };
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
